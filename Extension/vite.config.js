// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        background: 'src/background.js',
        popup: 'index.html' 
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  }
});