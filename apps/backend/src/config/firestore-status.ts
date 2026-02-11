import { db } from '@config/firebase.js';

export async function checkFirestoreConnection() {
  try {
    // Light operation → lists available collections
    await db.listCollections();

    // eslint-disable-next-line no-console
    console.log('Firestore Status: CONNECTED');
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Firestore Status: FAILED TO CONNECT');
    // eslint-disable-next-line no-console
    console.error(error);

    // In test environment, allow server to start even if Firestore is not reachable
    if (process.env.NODE_ENV === 'test') {
      // eslint-disable-next-line no-console
      console.warn(
        '⚠️ Ignoring Firestore connection error in TEST environment.',
      );
      return true;
    }

    return false;
  }
}
