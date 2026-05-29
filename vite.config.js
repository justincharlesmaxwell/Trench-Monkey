import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Deployed to GitHub Pages under /Trench-Monkey/, so assets must be served
// from that subpath in production. Locally (dev / preview) base stays '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Trench-Monkey/' : '/',
  plugins: [react()],
  test: {
    environment: 'node',
  },
}));
