import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy /api/* → Express na 3001 durante o dev (evita CORS)
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
