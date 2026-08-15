import { defineConfig, devices } from '@playwright/test'

// Backend endpoint for e2e run (dev server). The frontend `.env` may point at a
// LAN IP; we force a reachable backend URL so tests run against the running backend.
const API_URL = process.env.E2E_API_URL || 'http://localhost:8080/api/v1'
// Port 3000 is held by an orphaned socket on this machine, so the dev server
// falls back to 3001. Pin that port explicitly.
const E2E_PORT = process.env.E2E_PORT || '3001'
const BASE_URL = process.env.E2E_BASE_URL || `http://localhost:${E2E_PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: process.env.CI ? 1 : 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  outputDir: 'test-results',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: `npm run dev -- --port ${E2E_PORT} --strictPort`,
      url: `${BASE_URL}/login`,
      reuseExistingServer: true,
      timeout: 60_000,
      env: {
        ...process.env,
        VITE_API_URL: API_URL,
      },
    },
  ],
})