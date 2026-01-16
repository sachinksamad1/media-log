import { db } from './firebase.js';

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
    return false;
  }
}
