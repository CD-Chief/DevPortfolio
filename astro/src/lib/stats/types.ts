// Shape returned by /api/stats.json. Only these whitelisted fields ever reach the browser.
export interface StatsPayload {
	updatedAt: string; // ISO time the numbers were read from the source
	stale: boolean; // true when the source failed and this is the last good reading
	current: {
		cpu: number; // %
		mem: number; // %
		memUsedGb: number;
		memTotalGb: number;
		netIn: number; // MB/s
		netOut: number; // MB/s
		load: [number, number, number]; // 1m, 5m, 15m
		uptimeSec: number;
		containers: number | null;
	};
	// Roughly 24h of evenly spaced points, oldest first
	history: {
		t: number[]; // unix ms
		cpu: number[];
		mem: number[];
		netIn: number[];
		netOut: number[];
		load: number[];
	};
}
