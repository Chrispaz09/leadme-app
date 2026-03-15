import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Route local /api calls to ASP.NET Core to avoid CORS issues in development.
    proxy: {
      '/api': {
        target: 'https://localhost:7048',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
