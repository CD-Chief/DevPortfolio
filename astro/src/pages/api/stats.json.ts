import type { APIRoute } from 'astro';
import { BESZEL_URL, BESZEL_EMAIL, BESZEL_PASSWORD, BESZEL_SYSTEM } from 'astro:env/server';
import { getBeszelStats } from '../../lib/stats/beszel';
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

export const GET: APIRoute = async () => {
	// No hub configured: mock data in dev, and in production the panel hides itself on 503
	if (!BESZEL_URL || !BESZEL_EMAIL || !BESZEL_PASSWORD || !BESZEL_SYSTEM) {
		return import.meta.env.DEV ? json(mockStats()) : json({ error: 'unavailable' }, 503);
	}

	try {
		const stats = await getBeszelStats({
			url: BESZEL_URL.replace(/\/+$/, ''),
			email: BESZEL_EMAIL,
			password: BESZEL_PASSWORD,
			system: BESZEL_SYSTEM,
			debug: import.meta.env.DEV,
		});
		return json(stats);
	} catch {
		return json({ error: 'unavailable' }, 503);
	}
};
