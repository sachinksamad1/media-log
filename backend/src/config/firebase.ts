import env from '@config/env.js';
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: env.firebase.projectId,
    clientEmail: env.firebase.clientEmail,
    privateKey: env.firebase.privateKey,
  }),
  storageBucket: env.firebase.storageBucket,
});

export const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });
export const storage = admin.storage();
export const auth = admin.auth();
