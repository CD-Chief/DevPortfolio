// src/pages/api/pi-stats.json.ts
import type { APIRoute } from 'astro';
import { exec } from 'node:child_process';
import os from 'node:os';

function readCpuTemp(): Promise<number | null> {
  return new Promise((resolve) => {
    exec('vcgencmd measure_temp', (err, stdout) => {
      if (err || !stdout) {
        resolve(null);
        return;
      }
      const match = stdout.match(/temp=([\d.]+)/);
      resolve(match ? parseFloat(match[1]) : null);
    });
  });
}

export const GET: APIRoute = async () => {
  const cpuTempC = await readCpuTemp();

  const [load1, load5, load15] = os.loadavg();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  const data = {
    cpuTempC,
    load1,
    load5,
    load15,
    memory: {
      totalMb: Math.round(totalMem / 1024 / 1024),
      usedMb: Math.round(usedMem / 1024 / 1024),
      freeMb: Math.round(freeMem / 1024 / 1024),
    },
    uptimeSeconds: os.uptime(),
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
};
