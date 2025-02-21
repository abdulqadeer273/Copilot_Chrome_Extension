import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Ensures correct relative paths
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        sidepanel: 'public/index.html', // Ensures side panel loads correctly
        background: 'src/background.ts', // Includes background script
        main: 'src/main.tsx' // Ensures main.tsx is bundled
      },
      output: {
        entryFileNames: '[name].js' // Ensures correct output filenames
      }
    }
  },
  server: {
    hmr: false // Disables Hot Module Replacement (not needed for extensions)
  }
});
