// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html'], // ← important pour générer le HTML
    },
    globals: true,
    environment: 'jsdom',
  },
})
