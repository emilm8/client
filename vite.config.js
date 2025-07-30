import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
  base: '/',
  plugins: [react(), envCompatible()],
  server: {
    port: 3999,
    proxy: {
      '/api': {
        target: 'https://telefonclub.yetim.me',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
