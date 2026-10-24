import type { ContainerGroup, StatsPayload } from '../lib/stats/types';

const REFRESH_MS = 60_000;
const SVG_NS = 'http://www.w3.org/2000/svg';

type Series = { values: number[]; cls: string };

const timeFmt = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });

function formatUptime(sec: number) {
	const d = Math.floor(sec / 86400);
	const h = Math.floor((sec % 86400) / 3600);
	return d > 0 ? `${d}d ${h}h` : `${h}h ${Math.floor((sec % 3600) / 60)}m`;
}

function formatAgo(iso: string) {
	const s = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 1000));
	if (s < 60) return `${s}s ago`;
	if (s < 3600) return `${Math.round(s / 60)}m ago`;
	return `${Math.round(s / 3600)}h ago`;
}

// Line + area chart drawn in a 100 x 40 viewBox; stroke stays crisp via non-scaling-stroke
function drawChart(el: HTMLElement, t: number[], series: Series[], max: number, unit: string) {
	const svg = el.querySelector('svg');
	if (!svg || t.length < 2) return;
	const n = t.length;
	const x = (i: number) => (i / (n - 1)) * 100;
	const y = (v: number) => 40 - (Math.min(v, max) / max) * 38;

	svg.replaceChildren();
	for (const s of series) {
		const line = s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join('');
		if (el.dataset.area !== undefined && series.length === 1) {
			const area = document.createElementNS(SVG_NS, 'path');
			area.setAttribute('d', `${line}L100,40L0,40Z`);
			area.setAttribute('class', `area ${s.cls}`);
			svg.append(area);
		}
		const path = document.createElementNS(SVG_NS, 'path');
		path.setAttribute('d', line);
		path.setAttribute('class', `line ${s.cls}`);
		path.setAttribute('vector-effect', 'non-scaling-stroke');
		svg.append(path);
	}

	const axis = el.querySelector<HTMLElement>('.axis-max');
	if (axis) axis.textContent = `0–${+max.toFixed(2)}${unit.trim()}`;

	const label = el.dataset.label ?? '';
	const last = series.map((s) => s.values[n - 1]);
	el.setAttribute(
		'aria-label',
		`${label}, last 24 hours. Peak ${Math.max(...series[0].values)}${unit}, now ${last.join(' / ')}${unit}.`,
	);

	// Hover layer: crosshair, one dot per series and a tooltip
	const cross = el.querySelector<HTMLElement>('.crosshair');
	const tip = el.querySelector<HTMLElement>('.tip');
	const dots = el.querySelectorAll<HTMLElement>('.dot');
	if (!cross || !tip) return;

	el.onpointermove = (e) => {
		const rect = el.getBoundingClientRect();
		const i = Math.round(((e.clientX - rect.left) / rect.width) * (n - 1));
		const idx = Math.max(0, Math.min(n - 1, i));
		const left = `${x(idx)}%`;
		cross.style.left = left;
		dots.forEach((dot, k) => {
			const v = series[k]?.values[idx];
			if (v === undefined) return;
			dot.style.left = left;
			dot.style.top = `${(y(v) / 40) * 100}%`;
		});
		tip.textContent = `${timeFmt.format(t[idx])} · ${series.map((s) => s.values[idx]).join(' / ')}${unit}`;
		tip.style.left = `clamp(0px, calc(${left} - ${tip.offsetWidth / 2}px), calc(100% - ${tip.offsetWidth}px))`;
		el.classList.add('hovering');
	};
	el.onpointerleave = () => el.classList.remove('hovering');
}

function setText(root: HTMLElement, field: string, value: string) {
	root.querySelectorAll<HTMLElement>(`[data-field="${field}"]`).forEach((node) => (node.textContent = value));
}

// Round an axis maximum up to a readable number (1, 2, 2.5, 5 x 10^n)
function niceMax(v: number) {
	const mag = 10 ** Math.floor(Math.log10(v));
	return ([1, 2, 2.5, 5, 10].find((m) => m * mag >= v) ?? 10) * mag;
}

const formatRate = (kbs: number) => (kbs >= 1024 ? `${(kbs / 1024).toFixed(1)} MB/s` : `${kbs.toFixed(1)} KB/s`);
const formatSize = (mb: number) => (mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`);

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string) {
	const node = document.createElement(tag);
	node.className = className;
	if (text !== undefined) node.textContent = text;
	return node;
}

function renderContainers(list: HTMLElement, groups: ContainerGroup[]) {
	const max = Math.max(1, ...groups.map((g) => g.memMb));
	list.replaceChildren(
		...groups.map((g) => {
			const row = el('li', g.label === 'Other' ? 'crow crow--other' : 'crow');
			const name = el('span', 'cname', g.label);
			if (g.count > 1) name.append(el('small', '', ` ×${g.count}`));
			const bar = el('span', 'cbar');
			const fill = el('i', '');
			fill.style.width = `${Math.max(2, (g.memMb / max) * 100)}%`;
			bar.append(fill);
			row.append(name, bar, el('span', 'cval', formatSize(g.memMb)));
			return row;
		}),
	);
}

function renderHealthDots(dots: HTMLElement, total: number, healthy: number, unhealthy: number) {
	const kinds = [
		...Array<string>(unhealthy).fill('cdot cdot--bad'),
		...Array<string>(healthy).fill('cdot cdot--ok'),
		...Array<string>(Math.max(0, total - healthy - unhealthy)).fill('cdot'),
	].slice(0, 40);
	dots.replaceChildren(...kinds.map((k) => el('span', k)));
}

function render(root: HTMLElement, data: StatsPayload) {
	const { current: c, history: h } = data;

	setText(root, 'cpu', `${Math.round(c.cpu)}%`);
	setText(root, 'mem', `${Math.round(c.mem)}%`);
	setText(root, 'mem-detail', `${c.memUsedGb} / ${c.memTotalGb} GB`);
	setText(root, 'net-in', formatRate(c.netInKBs));
	setText(root, 'net-out', formatRate(c.netOutKBs));
	setText(root, 'net-24h', `${formatSize(c.net24hMb)} / 24h`);
	setText(root, 'load-1', c.load[0].toFixed(2));
	setText(root, 'load-5', c.load[1].toFixed(2));
	setText(root, 'load-15', c.load[2].toFixed(2));
	setText(root, 'uptime', formatUptime(c.uptimeSec));
	setText(root, 'uptime-since', `since ${new Date(Date.now() - c.uptimeSec * 1000).toLocaleDateString()}`);
	setText(root, 'containers', c.containers === null ? '–' : String(c.containers));

	const healthy = c.containersHealthy ?? 0;
	const unhealthy = c.containersUnhealthy ?? 0;
	setText(root, 'containers-health', `${healthy} healthy · ${unhealthy} unhealthy`);

	const ring = root.querySelector<SVGCircleElement>('[data-field="mem-ring"]');
	if (ring) ring.style.strokeDasharray = `${Math.min(100, Math.max(0, c.mem))} 100`;

	const dots = root.querySelector<HTMLElement>('[data-field="container-dots"]');
	if (dots && c.containers !== null) renderHealthDots(dots, c.containers, healthy, unhealthy);

	const list = root.querySelector<HTMLElement>('[data-field="top-containers"]');
	if (list) renderContainers(list, c.topContainers);

	const chart = (name: string) => root.querySelector<HTMLElement>(`[data-chart="${name}"]`);
	// Low floor so a quiet server still shows shape; real spikes rescale the axis
	const loadMax = niceMax(Math.max(0.25, ...h.load1, ...h.load5, ...h.load15) * 1.2);
	// Scale CPU to its 24h peak (at least 20%) so a quiet server isn't a flat line
	const cpuMax = Math.min(100, niceMax(Math.max(20, ...h.cpu) * 1.25));

	const cpuEl = chart('cpu');
	if (cpuEl) drawChart(cpuEl, h.t, [{ values: h.cpu, cls: 's1' }], cpuMax, '%');
	const loadEl = chart('load');
	if (loadEl)
		drawChart(
			loadEl,
			h.t,
			[
				{ values: h.load1, cls: 's1' },
				{ values: h.load5, cls: 's2 dashed' },
				{ values: h.load15, cls: 's3 dotted' },
			],
			loadMax,
			'',
		);
}

export function initLiveStats(root: HTMLElement) {
	let data: StatsPayload | null = null;

	const updateAgo = () => {
		if (data) setText(root, 'updated', `updated ${formatAgo(data.updatedAt)}`);
	};

	const load = async () => {
		try {
			const res = await fetch('/api/stats.json', { headers: { accept: 'application/json' } });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			data = (await res.json()) as StatsPayload;
			render(root, data);
			root.dataset.state = data.stale ? 'stale' : 'live';
		} catch {
			// Keep showing the last good reading; with nothing to show, hide the panel entirely
			root.dataset.state = data ? 'stale' : 'offline';
		}
		updateAgo();
	};

	load();
	setInterval(() => !document.hidden && load(), REFRESH_MS);
	setInterval(updateAgo, 5_000);
}
