import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
  vite: {
    server: {
      proxy: {
        '/v1': {
          target: 'https://gdrate.arcticwoof.xyz',
          changeOrigin: true,
          secure: false,
        },
        '/gd-api': {
          target: 'http://www.boomlings.com/database',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/gd-api/, ''),
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, _req, _res) => {
              proxyReq.setHeader('User-Agent', '');
            });
          },
        },
      },
    },
  },
});