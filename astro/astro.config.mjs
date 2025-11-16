// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
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
