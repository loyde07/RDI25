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
    port: 5173,
  },
  test: {
    environment: 'jsdom', // Pour émuler un environnement de navigateur
    globals: true,
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
  },
});
