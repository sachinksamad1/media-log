import env from '@config/env.js';

export const validateEnv = (): void => {
  const requiredFields = [
    { name: 'FB_PROJECT_ID', value: env.firebase.projectId },
    { name: 'FB_CLIENT_EMAIL', value: env.firebase.clientEmail },
    { name: 'FB_PRIVATE_KEY', value: env.firebase.privateKey },
    { name: 'FB_STORAGE_BUCKET', value: env.firebase.storageBucket },
  ];

  const missingFields = requiredFields
    .filter((field) => !field.value || field.value.trim() === '')
    .map((field) => field.name);

  if (missingFields.length > 0) {
    const missingList = missingFields.map((field) => `   - ${field}`).join('\n');
    throw new Error(`❌ MISSING ENVIRONMENT VARIABLES:\n${missingList}`);
  }

  // eslint-disable-next-line no-console
  console.log('✅ Environment variables validated successfully.');
};
