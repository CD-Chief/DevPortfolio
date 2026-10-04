// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Standalone Node server. Pages stay static; only routes with prerender = false run on demand.
  adapter: node({ mode: 'standalone' }),
  server: {
    host: true,              // listen on all network interfaces
    allowedHosts: ['chiefosei.dev']
  },
  vite: {
    server: {
      allowedHosts: ['chiefosei.dev']
    },
    preview: {
      allowedHosts: ['chiefosei.dev']
    },
    plugins: [tailwindcss()],
  },
});
