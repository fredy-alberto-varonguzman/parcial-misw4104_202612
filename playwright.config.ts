import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on',
    screenshot: 'on',
    video: 'on',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  // ← levanta ng serve antes de correr los tests
  webServer: {
    command: 'ng serve',
    url: 'http://localhost:4200',
    reuseExistingServer: true,
    timeout: 120000,
  },
});