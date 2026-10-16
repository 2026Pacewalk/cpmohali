import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // dev: forward API calls to the local Node server (npm run server)
  server: { proxy: { '/api': 'http://127.0.0.1:8090' } },
})
