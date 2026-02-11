/// <reference types="node" />
import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Directory where tests are located */
  testDir: './src/tests',

  /* Global setup and teardown */
  globalSetup: './src/tests/global-setup.ts',
  globalTeardown: './src/tests/global-teardown.ts',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: Boolean(process.env.CI),

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.BASE_URL || 'http://localhost:3001',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'on-first-retry',

    /* Maximum time each action such as `click()` can take */
    actionTimeout: 10000,

    /* Maximum time for navigation */
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* API Testing project (headless, no browser) */
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        // No browser needed for API tests
      },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results',

  /* Run Firebase Emulator + backend server before starting the tests */
  webServer: [
    {
      command:
        'npx firebase-tools emulators:start --only firestore,auth --project test-project-id',
      url: 'http://localhost:4000', // Emulator UI
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      cwd: '../../', // root of monorepo where firebase.json lives
    },
    {
      command: 'cross-env NODE_ENV=test tsx src/server.ts',
      url: 'http://localhost:3001/check',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      env: {
        NODE_ENV: 'test',
        PORT: '3001',
        FIRESTORE_EMULATOR_HOST: 'localhost:8080',
        FIREBASE_AUTH_EMULATOR_HOST: 'localhost:9099',
      },
    },
  ],

  /* Global timeout for each test */
  timeout: 30000,

  /* Expect timeout */
  expect: {
    timeout: 5000,
  },
});
