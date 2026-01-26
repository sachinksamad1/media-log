import config from '@config/env.js';
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: config.firebase.projectId,
    clientEmail: config.firebase.clientEmail,
    privateKey: config.firebase.privateKey,
  }),
  storageBucket: config.firebase.storageBucket,
});

export const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });
export const storage = admin.storage();
export const auth = admin.auth();
