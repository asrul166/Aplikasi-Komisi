import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The API is proxied so the session cookie stays same-origin.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: { '/api': 'http://localhost:3001' },
  },
})
