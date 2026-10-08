import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  workers: 2,
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5173 --strictPort --mode test',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: false,
  },
})
