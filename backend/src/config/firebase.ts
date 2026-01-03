import admin from "firebase-admin";
import serviceAccountKey from "./env.js";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccountKey.project_id,
    clientEmail: serviceAccountKey.client_email,
    privateKey: serviceAccountKey.private_key,
  }),
});

export const db = admin.firestore();
