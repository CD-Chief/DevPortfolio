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
	const mem: number[] = [];
	const netIn: number[] = [];
	const netOut: number[] = [];
	const load: number[] = [];

	for (let i = 0; i < POINTS; i++) {
		const ts = end - (POINTS - 1 - i) * STEP_MS;
		const seed = ts / STEP_MS;
		const hour = new Date(ts).getHours();
		// Busier during the day, quieter at night
		const daytime = Math.max(0, Math.sin(((hour - 6) / 24) * Math.PI * 2));

		t.push(ts);
		cpu.push(round(6 + daytime * 14 + noise(seed) * 9));
		mem.push(round(36 + daytime * 4 + noise(seed + 0.3) * 3));
		netIn.push(round(0.3 + daytime * 1.1 + noise(seed + 0.7) * 0.6, 2));
		netOut.push(round(0.1 + daytime * 0.35 + noise(seed + 0.9) * 0.2, 2));
		load.push(round(0.08 + daytime * 0.25 + noise(seed + 0.5) * 0.12, 2));
	}

	const last = POINTS - 1;
	return {
		updatedAt: new Date(now - 12_000).toISOString(),
		stale: false,
		current: {
			cpu: cpu[last],
			mem: mem[last],
			memUsedGb: round((mem[last] / 100) * 8),
			memTotalGb: 8,
			netIn: netIn[last],
			netOut: netOut[last],
			load: [load[last], round(load[last] * 0.85, 2), round(load[last] * 0.7, 2)],
			uptimeSec: 62 * 86400 + 4 * 3600,
			containers: 14,
		},
		history: { t, cpu, mem, netIn, netOut, load },
	};
}
