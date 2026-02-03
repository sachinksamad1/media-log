import config from '@config/env.js';
import type { CorsOptions } from 'cors';

/**
 * Production-safe CORS configuration
 *
 * Security considerations:
 * - Never use '*' (wildcard) in production
 * - Always explicitly list allowed origins
 * - Validate origin against whitelist
 * - Limit allowed methods and headers
 * - Consider credentials handling
 */

// Parse comma-separated origins from environment variable
const parseOrigins = (): string[] => {
  const originsEnv = config.cors.allowedOrigins || '';

  if (!originsEnv.trim()) {
    // Default development origins
    if (process.env.NODE_ENV !== 'production') {
      return [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:4200',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:4200',
      ];
    }
    // In production with no origins configured, reject all
    return [];
  }

  return originsEnv
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const allowedOrigins = parseOrigins();

/**
 * Origin validation function
 * Returns true if the origin is allowed, false otherwise
 */
const isOriginAllowed = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void,
): void => {
  // Allow requests with no origin (like mobile apps, curl, Postman)
  // In production, you might want to be stricter about this
  if (!origin) {
    // For non-browser clients, you can choose to allow or deny
    // Setting to true allows server-to-server and tool requests
    callback(null, true);
    return;
  }

  // Check if origin is in the allowed list
  if (allowedOrigins.includes(origin)) {
    callback(null, true);
    return;
  }

  // Check for pattern matching (e.g., preview deployments)
  // Patterns are loaded from CORS_PREVIEW_PATTERNS env variable
  // Format: comma-separated regex patterns (without delimiters)
  // Example: "^https://myapp--.*\\.web\\.app$,^https://.*\\.vercel\\.app$"
  if (config.cors.allowPreviewUrls) {
    const patternsEnv = config.cors.previewPatterns || '';
    const allowedPatterns = patternsEnv
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => {
        try {
          return new RegExp(p);
        } catch {
          // eslint-disable-next-line no-console
          console.warn(`[CORS] Invalid regex pattern: ${p}`);
          return null;
        }
      })
      .filter((p): p is RegExp => p !== null);

    const isPatternMatch = allowedPatterns.some((pattern) =>
      pattern.test(origin),
    );

    if (isPatternMatch) {
      callback(null, true);
      return;
    }
  }

  // Reject the request
  callback(new Error(`Origin ${origin} not allowed by CORS`), false);
};

/**
 * Production-safe CORS options
 */
export const corsOptions: CorsOptions = {
  origin: isOriginAllowed,

  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  // Allow cookies/credentials to be sent with requests
  // Set to true if your frontend needs to send auth cookies
  credentials: true,

  // Headers the client is allowed to use
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
  ],

  // Headers the client can access from the response
  exposedHeaders: ['Content-Length', 'Content-Range', 'X-Total-Count'],

  // How long the browser can cache the preflight response (in seconds)
  // 24 hours - reduces preflight requests for better performance
  maxAge: 86400,

  // Pass the CORS preflight response to the next handler
  preflightContinue: false,

  // Provide a success status code for legacy browsers (IE11, various SmartTVs)
  optionsSuccessStatus: 204,
};

/**
 * Get the list of currently allowed origins (for debugging/logging)
 */
export const getAllowedOrigins = (): string[] => [...allowedOrigins];

export default corsOptions;
