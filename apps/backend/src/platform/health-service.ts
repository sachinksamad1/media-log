import { db } from '@/config/firebase.js';

export async function checkHealth() {
  await db.doc('_health/ping').get();

  return {
    firestore: 'up',
  };
}
