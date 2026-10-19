import type { StatsPayload } from '../lib/stats/types';

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

function render(root: HTMLElement, data: StatsPayload) {
	const { current: c, history: h } = data;

	setText(root, 'cpu', `${Math.round(c.cpu)}%`);
	setText(root, 'mem', `${Math.round(c.mem)}%`);
	setText(root, 'mem-detail', `${c.memUsedGb} / ${c.memTotalGb} GB`);
	setText(root, 'net-in', `${c.netIn.toFixed(2)}`);
	setText(root, 'net-out', `${c.netOut.toFixed(2)}`);
	setText(root, 'load', c.load[0].toFixed(2));
	setText(root, 'load-detail', `${c.load[1].toFixed(2)} · ${c.load[2].toFixed(2)}`);
	setText(root, 'uptime', formatUptime(c.uptimeSec));
	setText(root, 'uptime-since', `since ${new Date(Date.now() - c.uptimeSec * 1000).toLocaleDateString()}`);
	setText(root, 'containers', c.containers === null ? '–' : String(c.containers));

	const bar = root.querySelector<HTMLElement>('[data-field="mem-bar"]');
	if (bar) bar.style.width = `${Math.min(100, c.mem)}%`;

	const dots = root.querySelector<HTMLElement>('[data-field="container-dots"]');
	if (dots && c.containers !== null) {
		dots.replaceChildren(
			...Array.from({ length: Math.min(c.containers, 40) }, () => {
				const d = document.createElement('span');
				d.className = 'cdot';
				return d;
			}),
		);
	}

	const chart = (name: string) => root.querySelector<HTMLElement>(`[data-chart="${name}"]`);
	const netMax = Math.max(0.5, ...h.netIn, ...h.netOut) * 1.15;
	const loadMax = Math.max(1, ...h.load) * 1.15;

	const cpuEl = chart('cpu');
	if (cpuEl) drawChart(cpuEl, h.t, [{ values: h.cpu, cls: 's1' }], 100, '%');
	const memEl = chart('mem');
	if (memEl) drawChart(memEl, h.t, [{ values: h.mem, cls: 's2' }], 100, '%');
	const netEl = chart('net');
	if (netEl)
		drawChart(netEl, h.t, [{ values: h.netIn, cls: 's1' }, { values: h.netOut, cls: 's2 dashed' }], netMax, ' MB/s');
	const loadEl = chart('load');
	if (loadEl) drawChart(loadEl, h.t, [{ values: h.load, cls: 's1' }], loadMax, '');
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
