import type { APIRoute } from 'astro';

// Liveness check: confirms the server is up and routing requests.
// Used by the PR smoke test, the Docker HEALTHCHECK, and the Coolify health check.
export const prerender = false;

export const GET: APIRoute = () => {
	return new Response(JSON.stringify({ status: 'ok' }), {
		status: 200,
		headers: {
			'content-type': 'application/json',
			'cache-control': 'no-store',
		},
	});
};
