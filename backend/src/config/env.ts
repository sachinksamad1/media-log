import dotenv from 'dotenv';
dotenv.config();

const env = {
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  },
};

// Basic validation to catch missing variables early
if (!env.firebase.privateKey || !env.firebase.projectId) {
  throw new Error(
    'Missing critical Firebase environment variables in .env file',
  );
}

export default env;
