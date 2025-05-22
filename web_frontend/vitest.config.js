import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'], // important pour générer les bons rapports
      reportsDirectory: './coverage',
      exclude: ['**/tests/**', '**/__tests__/**', '**/node_modules/**'],
    },
  },
})