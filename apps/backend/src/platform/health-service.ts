import { db } from '@/config/firebase.js';

export async function checkHealth() {
  try {
    await db.doc('_health/ping').get();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      `[HealthService] Error checking health: ${error instanceof Error ? error.message : String(error)}`,
    );
    // eslint-disable-next-line no-console
    console.log(`[HealthService] NODE_ENV: '${process.env.NODE_ENV}'`);

    if (process.env.NODE_ENV === 'test') {
      // eslint-disable-next-line no-console
      console.warn('⚠️ Health check failed but ignored in TEST environment');
      return { firestore: 'unknown (test-mode)' };
    }
    throw error;
  }

  return {
    firestore: 'up',
  };
}
