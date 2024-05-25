import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'src/main.jsx', // Your main entry point
        blocker: 'src/components/blocker.jsx',
        error: 'src/components/error.jsx',
        options: 'src/main_options.jsx', // Options page entry point
        popup: 'index.html',
        option: 'options.html'
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
