// Server-only Beszel client. The hub URL and credentials never leave this module;
// callers only get the whitelisted StatsPayload.
import type { ContainerGroup, StatsPayload } from './types';
import { CONTAINER_ALIASES, OTHER_LABEL, TOP_CONTAINERS } from '../../data/containers';

export interface BeszelConfig {
	url: string;
	email: string;
	password: string;
	system: string; // system name as shown in Beszel
	// Log container names that have no alias, to help fill in src/data/containers.ts
	debug?: boolean;
}

const CACHE_MS = 45_000;
const TIMEOUT_MS = 5_000;
// Readings older than this are flagged stale even if the hub answered
const STALE_AFTER_MS = 5 * 60_000;
const DAY_MS = 24 * 60 * 60_000;
const KB = 1024;
const MB = 1024 * 1024;
// 20m history records each cover this many seconds
const HISTORY_STEP_SEC = 20 * 60;

// Subset of Beszel's system_stats.stats; older agents send ns/nr (MB/s) instead of b (bytes/s)
interface BeszelStats {
	cpu: number;
	m: number; // memory total, GB
	mu: number; // memory used, GB
	mp: number; // memory %
	b?: [number, number]; // [sent, recv] bytes/s
	ns?: number;
	nr?: number;
	la?: [number, number, number];
}

interface BeszelSystem {
	id: string;
	status: string; // up | down | paused | pending
	updated: string;
	info: { cpu: number; mp: number; u: number; la?: [number, number, number] };
}

interface BeszelContainer {
	name: string;
	image: string;
	memory: number; // MB
	cpu: number; // %
	health: number; // 0 none, 1 starting, 2 healthy, 3 unhealthy
}

interface StatsRecord {
	created: string;
	stats: BeszelStats;
}

interface ListResponse<T> {
	items: T[];
	totalItems: number;
}

let token: string | null = null;
let cached: { at: number; payload: StatsPayload } | null = null;
let inflight: Promise<StatsPayload> | null = null;

const round = (n: number, dp = 1) => Math.round(n * 10 ** dp) / 10 ** dp;
// PocketBase dates look like "2026-10-19 19:05:48.779Z"
const parseDate = (s: string) => Date.parse(s.replace(' ', 'T'));
const pbDate = (ms: number) => new Date(ms).toISOString().replace('T', ' ');
const quote = (s: string) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

// [in, out] in bytes/s
function netBytes(s: BeszelStats): [number, number] {
	if (s.b) return [s.b[1], s.b[0]];
	return [(s.nr ?? 0) * MB, (s.ns ?? 0) * MB];
}

const aliasFor = (c: BeszelContainer) => CONTAINER_ALIASES.find(({ match }) => match.test(c.name) || match.test(c.image));
const pinnedLabels = new Set(CONTAINER_ALIASES.filter((a) => a.pinned).map((a) => a.label));

// Sum containers by alias, keep the biggest few, fold the rest into "Other"
function groupContainers(containers: BeszelContainer[], debug = false): ContainerGroup[] {
	const groups = new Map<string, ContainerGroup>();
	const unlabelled: string[] = [];
	for (const c of containers) {
		const label = aliasFor(c)?.label;
		if (!label) unlabelled.push(`${c.name} (${c.image})`);
		const key = label ?? OTHER_LABEL;
		const g = groups.get(key) ?? { label: key, memMb: 0, cpu: 0, count: 0 };
		g.memMb += c.memory;
		g.cpu += c.cpu;
		g.count++;
		groups.set(key, g);
	}
	// Server log only, never sent to the browser
	if (debug && unlabelled.length) console.warn('[stats] unlabelled containers:', unlabelled.join(', '));

	const other = groups.get(OTHER_LABEL);
	groups.delete(OTHER_LABEL);
	const byMem = [...groups.values()].sort((a, b) => b.memMb - a.memMb);
	// Pinned groups always make the cut; the biggest of the rest fill the remaining rows
	const pinned = byMem.filter((g) => pinnedLabels.has(g.label));
	const unpinned = byMem.filter((g) => !pinnedLabels.has(g.label));
	const fill = unpinned.splice(0, Math.max(0, TOP_CONTAINERS - pinned.length));
	const named = [...fill, ...pinned].sort((a, b) => b.memMb - a.memMb);
	const rest = [...unpinned, ...(other ? [other] : [])];
	const folded = rest.reduce<ContainerGroup | null>(
		(acc, g) => ({ label: OTHER_LABEL, memMb: (acc?.memMb ?? 0) + g.memMb, cpu: (acc?.cpu ?? 0) + g.cpu, count: (acc?.count ?? 0) + g.count }),
		null,
	);
	return [...named, ...(folded ? [folded] : [])].map((g) => ({ ...g, memMb: Math.round(g.memMb), cpu: round(g.cpu) }));
}

async function authenticate(cfg: BeszelConfig) {
	const res = await fetch(`${cfg.url}/api/collections/users/auth-with-password`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ identity: cfg.email, password: cfg.password }),
		signal: AbortSignal.timeout(TIMEOUT_MS),
	});
	if (!res.ok) throw new Error(`Beszel auth failed: ${res.status}`);
	token = ((await res.json()) as { token: string }).token;
}

async function list<T>(cfg: BeszelConfig, collection: string, params: Record<string, string>, retry = true): Promise<ListResponse<T>> {
	if (!token) await authenticate(cfg);
	const qs = new URLSearchParams(params);
	const res = await fetch(`${cfg.url}/api/collections/${collection}/records?${qs}`, {
		headers: { authorization: token! },
		signal: AbortSignal.timeout(TIMEOUT_MS),
	});
	// Expired token: log in again once
	if ((res.status === 401 || res.status === 403) && retry) {
		token = null;
		return list(cfg, collection, params, false);
	}
	if (!res.ok) throw new Error(`Beszel ${collection} request failed: ${res.status}`);
	return (await res.json()) as ListResponse<T>;
}

async function fetchFromHub(cfg: BeszelConfig): Promise<StatsPayload> {
	const systems = await list<BeszelSystem>(cfg, 'systems', {
		filter: `name=${quote(cfg.system)}`,
		perPage: '1',
		fields: 'id,status,updated,info',
	});
	const system = systems.items[0];
	if (!system) throw new Error(`Beszel system "${cfg.system}" not found or not shared with this user`);

	const bySystem = `system=${quote(system.id)}`;
	const [latest, history, containers] = await Promise.all([
		list<StatsRecord>(cfg, 'system_stats', {
			filter: `${bySystem} && type="1m"`,
			sort: '-created',
			perPage: '1',
			fields: 'created,stats',
		}),
		list<StatsRecord>(cfg, 'system_stats', {
			filter: `${bySystem} && type="20m" && created>=${quote(pbDate(Date.now() - DAY_MS))}`,
			sort: 'created',
			perPage: '100',
			fields: 'created,stats',
		}),
		list<BeszelContainer>(cfg, 'containers', {
			filter: bySystem,
			perPage: '200',
			fields: 'name,image,memory,cpu,health',
		}).catch(() => null),
	]);

	const now = latest.items[0]?.stats ?? history.items.at(-1)?.stats;
	if (!now) throw new Error('Beszel returned no stats yet');

	const [netIn, netOut] = netBytes(now);
	const load = now.la ?? system.info.la ?? [0, 0, 0];
	const updatedMs = latest.items[0] ? parseDate(latest.items[0].created) : parseDate(system.updated);
	const points = history.items;
	const net24hBytes = points.reduce((sum, p) => {
		const [i, o] = netBytes(p.stats);
		return sum + (i + o) * HISTORY_STEP_SEC;
	}, 0);
	const ctr = containers?.items ?? null;

	return {
		updatedAt: new Date(updatedMs).toISOString(),
		stale: system.status !== 'up' || Date.now() - updatedMs > STALE_AFTER_MS,
		current: {
			cpu: round(now.cpu),
			mem: round(now.mp),
			memUsedGb: round(now.mu),
			memTotalGb: round(now.m),
			netInKBs: round(netIn / KB),
			netOutKBs: round(netOut / KB),
			net24hMb: Math.round(net24hBytes / MB),
			load: [round(load[0], 2), round(load[1], 2), round(load[2], 2)],
			uptimeSec: system.info.u,
			containers: ctr ? ctr.length : null,
			containersHealthy: ctr ? ctr.filter((c) => c.health === 2).length : null,
			containersUnhealthy: ctr ? ctr.filter((c) => c.health === 3).length : null,
			topContainers: ctr ? groupContainers(ctr, cfg.debug) : [],
		},
		history: {
			t: points.map((p) => parseDate(p.created)),
			cpu: points.map((p) => round(p.stats.cpu)),
			load1: points.map((p) => round(p.stats.la?.[0] ?? 0, 2)),
			load5: points.map((p) => round(p.stats.la?.[1] ?? 0, 2)),
			load15: points.map((p) => round(p.stats.la?.[2] ?? 0, 2)),
		},
	};
}

// Cached for CACHE_MS; concurrent callers share one hub request.
// If the hub fails, the last good reading is returned marked stale; with none, this throws.
export async function getBeszelStats(cfg: BeszelConfig): Promise<StatsPayload> {
	if (cached && Date.now() - cached.at < CACHE_MS) return cached.payload;

	inflight ??= fetchFromHub(cfg)
		.then((payload) => {
			cached = { at: Date.now(), payload };
			return payload;
		})
		.catch((err) => {
			console.error('[stats]', err instanceof Error ? err.message : err);
			if (!cached) throw err;
			// Keep serving the old reading, but retry the hub on the next cache window
			cached = { at: Date.now(), payload: { ...cached.payload, stale: true } };
			return cached.payload;
		})
		.finally(() => {
			inflight = null;
		});

	return inflight;
}
