import env from './env.js';

export const validateEnv = (): void => {
  const requiredFields = [
    { name: 'FIREBASE_PROJECT_ID', value: env.firebase.projectId },
    { name: 'FIREBASE_CLIENT_EMAIL', value: env.firebase.clientEmail },
    { name: 'FIREBASE_PRIVATE_KEY', value: env.firebase.privateKey },
    { name: 'FIREBASE_STORAGE_BUCKET', value: env.firebase.storageBucket },
  ];

  const missingFields = requiredFields
    .filter((field) => !field.value || field.value.trim() === '')
    .map((field) => field.name);

  if (missingFields.length > 0) {
    const missingList = missingFields.map((field) => `   - ${field}`).join('\n');
    throw new Error(`❌ MISSING ENVIRONMENT VARIABLES:\n${missingList}`);
  }

  console.log('✅ Environment variables validated successfully.');
};
