import { defineConfig } from '@playwright/test';
import { DEFAULT_VIEWPORT, STORAGE_STATE_PATH } from './config/constants';
import { env } from './config/environment';
import { buildProjects } from './config/projects';

export default defineConfig({
  globalSetup: './global-setup.js',
  testDir: './tests',
  timeout: env.testTimeout,
  fullyParallel: false,
  forbidOnly: env.isCI,
  retries: env.retries,
  workers: env.workers,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: env.baseURL,
    // reuse storage state saved by global setup to bypass consent dialog
    storageState: STORAGE_STATE_PATH,
    headless: env.headless,
    viewport: DEFAULT_VIEWPORT,
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },
  projects: buildProjects(env.browsers)
});
