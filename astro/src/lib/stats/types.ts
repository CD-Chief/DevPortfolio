// One row of the "top containers" widget. Labels come from src/data/containers.ts,
// never from raw container names.
export interface ContainerGroup {
	label: string;
	memMb: number;
	cpu: number; // %
	count: number; // containers in this group
}

// Shape returned by /api/stats.json. Only these whitelisted fields ever reach the browser.
export interface StatsPayload {
	updatedAt: string; // ISO time the numbers were read from the source
	stale: boolean; // true when the source failed and this is the last good reading
	current: {
		cpu: number; // %
		mem: number; // %
		memUsedGb: number;
		memTotalGb: number;
		netInKBs: number;
		netOutKBs: number;
		net24hMb: number; // in + out over the history window
		load: [number, number, number]; // 1m, 5m, 15m
		uptimeSec: number;
		containers: number | null;
		containersHealthy: number | null;
		containersUnhealthy: number | null;
		topContainers: ContainerGroup[]; // biggest by memory first, "Other" last
	};
	// Roughly 24h of evenly spaced points, oldest first
	history: {
		t: number[]; // unix ms
		cpu: number[];
		load1: number[];
		load5: number[];
		load15: number[];
	};
}
