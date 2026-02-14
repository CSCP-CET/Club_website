import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.JPG'], // Include .JPG files as assets
  server: {
    port: 5173,
    strictPort: true,
  },
});

