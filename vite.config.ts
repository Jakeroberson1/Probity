import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Multi-page build: each page is real HTML at its own URL, so /about/ and
// /coming-soon/ work on any static host without rewrite rules.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        home: path.resolve(__dirname, 'index.html'),
        about: path.resolve(__dirname, 'about/index.html'),
        comingSoon: path.resolve(__dirname, 'coming-soon/index.html'),
      },
    },
  },
})
