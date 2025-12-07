// src/pages/api/pi-stats.json.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  // Example: fake data for now
  const data = {
    cpuTemp: 48.2,
    load1: 0.12,
    load5: 0.09,
    memoryUsedMb: 620,
    memoryTotalMb: 3900,
    uptimeSeconds: 123456,
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
};
