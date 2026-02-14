import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
})
