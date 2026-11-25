import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env.js';
import { TEST_TIMEOUT_MS } from './src/data/scenario.data.js';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: TEST_TIMEOUT_MS,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: env.baseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});