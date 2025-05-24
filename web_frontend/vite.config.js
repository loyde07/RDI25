import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Redirige vers le serveur Express
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    environment: 'jsdom', // Pour émuler un environnement de navigateur
    globals: true,
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
  },
});
