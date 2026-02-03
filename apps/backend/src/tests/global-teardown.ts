import type { FullConfig } from '@playwright/test';

/**
 * Global teardown runs once after all tests
 * Use this for:
 * - Database cleanup
 * - Resource cleanup
 * - Report generation
 */
async function globalTeardown(_config: FullConfig): Promise<void> {
  /* eslint-disable no-console */
  console.log('🧹 Starting global test teardown...');

  // Add your global teardown logic here:
  // - Clean up test data
  // - Close connections
  // - Generate summary reports

  console.log('✅ Global test teardown complete');
}

export default globalTeardown;
