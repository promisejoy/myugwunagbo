import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // ✅ CORRECT: manualChunks as a function
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split vendor chunks
            if (id.includes('react')) {
              return 'vendor-react';
            }
            if (id.includes('react-router-dom')) {
              return 'vendor-router';
            }
            if (id.includes('react-hot-toast')) {
              return 'vendor-toast';
            }
            if (id.includes('react-icons')) {
              return 'vendor-icons';
            }
            if (id.includes('react-pdf')) {
              return 'vendor-pdf';
            }
            if (id.includes('axios')) {
              return 'vendor-axios';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // All other node_modules
            return 'vendor';
          }
        }
      }
    }
  },
  define: {
    'process.env': {}
  }
})