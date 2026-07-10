import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './scripts/google-play',
  testMatch: 'capture-screenshots.ts',
  timeout: 120000,
  use: {
    baseURL: process.env.APP_URL ?? 'http://localhost:8081',
    viewport: { width: 1080, height: 1920 },
    screenshot: 'off',
    trace: 'off',
  },
  reporter: [['list']],
});
