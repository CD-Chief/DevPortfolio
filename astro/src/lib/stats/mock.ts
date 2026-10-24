import type { StatsPayload } from './types';

const POINTS = 48;
const STEP_MS = 30 * 60 * 1000;

// Deterministic noise in [0, 1) so the mock curve stays stable between reloads
const noise = (i: number) => {
	const x = Math.sin(i * 12.9898) * 43758.5453;
	return x - Math.floor(x);
};

const round = (n: number, dp = 1) => Math.round(n * 10 ** dp) / 10 ** dp;

// Plausible-looking data for local development, used when no Beszel hub is configured
export function mockStats(now = Date.now()): StatsPayload {
	const end = Math.floor(now / STEP_MS) * STEP_MS;
	const t: number[] = [];
	const cpu: number[] = [];
	const load1: number[] = [];
	const load5: number[] = [];
	const load15: number[] = [];

	for (let i = 0; i < POINTS; i++) {
		const ts = end - (POINTS - 1 - i) * STEP_MS;
		const seed = ts / STEP_MS;
		const hour = new Date(ts).getHours();
		// Busier during the day, quieter at night
		const daytime = Math.max(0, Math.sin(((hour - 6) / 24) * Math.PI * 2));

		t.push(ts);
		cpu.push(round(6 + daytime * 14 + noise(seed) * 9));
		const l1 = 0.08 + daytime * 0.25 + noise(seed + 0.5) * 0.12;
		load1.push(round(l1, 2));
		// Longer windows are smoother and lag behind
		load5.push(round((load5.at(-1) ?? l1) * 0.6 + l1 * 0.4, 2));
		load15.push(round((load15.at(-1) ?? l1) * 0.8 + l1 * 0.2, 2));
	}

	const last = POINTS - 1;
	return {
		updatedAt: new Date(now - 12_000).toISOString(),
		stale: false,
		current: {
			cpu: cpu[last],
			mem: 63.2,
			memUsedGb: 2.4,
			memTotalGb: 3.8,
			netInKBs: 12.4,
			netOutKBs: 3.1,
			net24hMb: 1380,
			load: [load1[last], load5[last], load15[last]],
			uptimeSec: 62 * 86400 + 4 * 3600,
			containers: 15,
			containersHealthy: 9,
			containersUnhealthy: 0,
			topContainers: [
				{ label: 'Coolify', memMb: 512, cpu: 1.8, count: 5 },
				{ label: 'Client sites', memMb: 386, cpu: 2.1, count: 4 },
				{ label: 'Traefik', memMb: 64, cpu: 0.4, count: 1 },
				{ label: 'Umami', memMb: 58, cpu: 0.2, count: 2 },
				{ label: 'This site', memMb: 46, cpu: 0.3, count: 1 },
				{ label: 'Other', memMb: 120, cpu: 0.6, count: 2 },
			],
		},
		history: { t, cpu, load1, load5, load15 },
	};
}
