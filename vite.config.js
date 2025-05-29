import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Barcha qurilmalarga ochish
    port: 5173       // Istalgan port (masalan, 5173)
  }
})