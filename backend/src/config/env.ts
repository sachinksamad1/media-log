import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';

const getEnvName = () => {
  if (process.env.NODE_ENV) return process.env.NODE_ENV;

  // Detect Firebase Functions environment
  if (process.env.FUNCTION_TARGET || process.env.K_SERVICE) {
    return 'prod';
  }

  return 'dev';
};

const env = getEnvName();
const envFile = `.env.${env}`;
const envPath = path.resolve(process.cwd(), envFile);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else if (env !== 'prod' && fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
}

// eslint-disable-next-line no-console
console.log(`[Config] Environment: ${env}`);
if (fs.existsSync(envPath)) {
  // eslint-disable-next-line no-console
  console.log(`[Config] Loaded configuration from ${envFile}`);
} else {
  // eslint-disable-next-line no-console
  console.log(
    `[Config] No config file found for ${envFile}, using process environment.`,
  );
}

// Try to import firebase-functions safely to avoid crashing in non-firebase environments
type FirebaseConfig = {
  env?: {
    [key: string]: string | undefined;
  };
  [key: string]: unknown;
};

let firebaseFunctionsConfig: FirebaseConfig = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { config } = require('firebase-functions');
  firebaseFunctionsConfig = config() as FirebaseConfig;
} catch {
  // Ignore error if firebase-functions is not available
}

const getEnvVar = (key: string, configKey: string): string | undefined => {
  return process.env[key] || firebaseFunctionsConfig.env?.[configKey];
};

const config = {
  firebase: {
    projectId: getEnvVar('FB_PROJECT_ID', 'fb_project_id'),
    clientEmail: getEnvVar('FB_CLIENT_EMAIL', 'fb_client_email'),
    privateKey: getEnvVar('FB_PRIVATE_KEY', 'fb_private_key')?.replace(
      /\\n/g,
      '\n',
    ),
    storageBucket: getEnvVar('FB_STORAGE_BUCKET', 'fb_storage_bucket'),
  },
  cors: {
    allowedOrigins: getEnvVar('CORS_ALLOWED_ORIGINS', 'cors_allowed_origins'),
    allowPreviewUrls:
      getEnvVar('CORS_ALLOW_PREVIEW_URLS', 'cors_allow_preview_urls') ===
      'true',
    previewPatterns: getEnvVar(
      'CORS_PREVIEW_PATTERNS',
      'cors_preview_patterns',
    ),
  },
};

// Basic validation to catch missing variables early
if (!config.firebase.privateKey || !config.firebase.projectId) {
  throw new Error(
    'Missing critical Firebase environment variables in .env file or Firebase Config',
  );
}

export default config;
