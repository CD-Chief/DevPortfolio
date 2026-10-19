// astro.config.mjs
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Used for canonical and Open Graph URLs
  site: 'https://chiefosei.dev',
  // Standalone Node server. Pages stay static; only routes with prerender = false run on demand.
  adapter: node({ mode: 'standalone' }),
  // Writes sitemap-index.xml and sitemap-0.xml at build time from the prerendered pages
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/api/'),
      // Match the canonical URLs, which have no trailing slash (except the homepage)
      serialize: (item) => ({ ...item, url: item.url.replace(/(.)\/$/, '$1') }),
    }),
  ],
  // Server-only secrets, read at runtime (not inlined at build time). All optional:
  // without them the live stats endpoint returns 503 and the homepage hides the panel.
  env: {
    schema: {
      BESZEL_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      BESZEL_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      BESZEL_PASSWORD: envField.string({ context: 'server', access: 'secret', optional: true }),
      BESZEL_SYSTEM: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
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
