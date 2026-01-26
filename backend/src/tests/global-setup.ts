import type { FullConfig } from '@playwright/test';

/**
 * Global setup runs once before all tests
 * Use this for:
 * - Database seeding
 * - Authentication setup
 * - Environment validation
 */
async function globalSetup(config: FullConfig): Promise<void> {
  /* eslint-disable no-console */
  console.log('🚀 Starting global test setup...');

  // Validate required environment variables
  const requiredEnvVars = ['BASE_URL'];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName] && !config.projects[0]?.use?.baseURL,
  );

  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing optional env vars: ${missingVars.join(', ')}`);
  }

  // Add your global setup logic here:
  // - Seed test database
  // - Create test users
  // - Generate auth tokens

  console.log('✅ Global test setup complete');
}

export default globalSetup;
