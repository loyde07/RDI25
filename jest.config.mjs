export default {
  rootDir: './api_backend', // Indique à Jest où commencer
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  coverageDirectory: '../coverage', // revient à la racine du projet
  coverageReporters: ['text', 'html'],
  testMatch: [
    "**/tests/**/*.test.js", // cible les tests dans le dossier api_backend/tests/
  ]
};
