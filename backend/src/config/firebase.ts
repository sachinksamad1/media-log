import admin from 'firebase-admin';

import env from './env.js';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: env.firebase.projectId,
    clientEmail: env.firebase.clientEmail,
    privateKey: env.firebase.privateKey,
  }),
  storageBucket: env.firebase.storageBucket,
});

export const db = admin.firestore();
export const storage = admin.storage();
