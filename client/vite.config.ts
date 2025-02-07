import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin(), splitVendorChunkPlugin()],
  build: {
    outDir: 'build',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
    port: 3000
  },
});