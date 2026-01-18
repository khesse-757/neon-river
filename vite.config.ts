import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@game': resolve(__dirname, 'src/game'),
      '@entities': resolve(__dirname, 'src/entities'),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: 'ES2022',
    sourcemap: true,
  },
});
