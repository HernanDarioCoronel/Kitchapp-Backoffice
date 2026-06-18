import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  root: './src/renderer',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer/src'),
      '@renderer': path.resolve(__dirname, 'src/renderer/src'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@resources': path.resolve(__dirname, 'resources')
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'dist-web'),
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
