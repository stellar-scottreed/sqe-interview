import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During local dev the React app runs on :5173 and proxies /api to the
// backend on :4000. In production the backend serves the built dist/ directly.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
