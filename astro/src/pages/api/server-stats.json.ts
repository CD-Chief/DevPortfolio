// src/pages/api/server-stats.json.ts
import type { APIRoute } from 'astro';
import os from 'node:os';

// Run on every request instead of once at build time
export const prerender = false;

// Short cache so a public endpoint can't be hammered
let cached: { at: number; body: string } | null = null;

// os.cpus() times are totals since boot, so CPU usage comes from the difference between two samples
function sampleCpu(): { idle: number; total: number } {
	let idle = 0;
	let total = 0;
	for (const cpu of os.cpus()) {
		const { user, nice, sys, idle: cpuIdle, irq } = cpu.times;
		idle += cpuIdle;
		total += user + nice + sys + cpuIdle + irq;
	}
	return { idle, total };
}

let lastSample: { idle: number; total: number } | null = null;

async function cpuPercent(): Promise<number> {
	if (!lastSample) {
		// First request after start: take a short sample so there is something to compare against
		lastSample = sampleCpu();
		await new Promise((resolve) => setTimeout(resolve, 300));
	}
	const now = sampleCpu();
	const idleDelta = now.idle - lastSample.idle;
	const totalDelta = now.total - lastSample.total;
	lastSample = now;
	if (totalDelta <= 0) return 0;
	return Math.round((1 - idleDelta / totalDelta) * 100);
}

export const GET: APIRoute = async () => {
	if (!cached || Date.now() - cached.at > 5000) {
		const [load1, load5, load15] = os.loadavg();
		const totalMem = os.totalmem();
		const freeMem = os.freemem();
		const cpu = await cpuPercent();

		cached = {
			at: Date.now(),
			body: JSON.stringify({
				cpuPercent: cpu,
				load1,
				load5,
				load15,
				memory: {
					totalMb: Math.round(totalMem / 1024 / 1024),
					usedMb: Math.round((totalMem - freeMem) / 1024 / 1024),
					freeMb: Math.round(freeMem / 1024 / 1024),
				},
				uptimeSeconds: os.uptime(),
			}),
		};
	}

	return new Response(cached.body, {
		status: 200,
		headers: {
			'content-type': 'application/json',
			'cache-control': 'no-store',
		},
	});
};
