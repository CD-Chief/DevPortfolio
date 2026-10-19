import type { APIRoute } from 'astro';
import { mockStats } from '../../lib/stats/mock';

// Run on every request instead of once at build time
export const prerender = false;

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json',
			'cache-control': 'no-store',
		},
	});

export const GET: APIRoute = () => {
	// No hub configured: mock data in dev, and in production the panel hides itself on 503
	if (!process.env.BESZEL_URL) {
		return import.meta.env.DEV ? json(mockStats()) : json({ error: 'unavailable' }, 503);
	}

	// Beszel source is wired up in the next step
	return json({ error: 'unavailable' }, 503);
};
