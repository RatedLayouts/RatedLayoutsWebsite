import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  output: 'static',
  vite: {
    server: {
      proxy: {
        '/v1': {
          target: 'https://gdrate.arcticwoof.xyz',
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: 'https://gdrate.arcticwoof.xyz',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
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


