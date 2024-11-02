import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import daisyui from 'daisyui';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    daisyui
  ],
  server: {
    port: 3000, // Set the dev server port
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Your backend server
        changeOrigin: true,              // Change the origin of the host header to the target URL
      },
    },
  },
});
