/* eslint-disable no-console */
/* eslint-disable n/no-process-exit */
import dotenv from 'dotenv';

import { auth } from '../src/config/firebase.js';

// Load environment variables
dotenv.config({ path: '.env.development' });

const FIREBASE_API_KEY = process.env.FIREBASE_WEB_API_KEY;

if (!FIREBASE_API_KEY) {
  console.error('❌ FIREBASE_WEB_API_KEY is missing in .env.development');
  process.exit(1);
}

async function generateToken(uid: string) {
  try {
    console.log(`Generating token for UID: ${uid}...`);

    // 1. Create a custom token using Admin SDK
    const customToken = await auth.createCustomToken(uid);
    console.log('✅ Custom Token generated.');

    // 2. Exchange Custom Token for ID Token using Firebase Auth REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: customToken,
          returnSecureToken: true,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Failed to exchange custom token:', data);
      process.exit(1);
    }

    console.log('\n✅ Bearer Token (ID Token):\n');
    console.log(data.idToken);
    console.log(
      '\nCopy the token above and use it in your Authorization header:',
    );
    console.log(`Bearer ${data.idToken}`);
  } catch (error) {
    console.error('❌ Error generating token:', error);
    process.exit(1);
  }
}

// Default UID 'user_alpha' (from seed) or passed as argument
const uid = process.argv[2] || 'user_alpha';
void generateToken(uid);
