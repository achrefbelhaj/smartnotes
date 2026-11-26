import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Si le port 5173 est pris, Vite s'arrête au lieu de choisir un autre port.
    // Important : le CORS du backend n'autorise QUE http://localhost:5173.
    strictPort: true,
  },
})