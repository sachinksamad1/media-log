import { validateEnv } from '@config/env-validator.js';
import type { Express } from 'express';
import { onInit } from 'firebase-functions/v2'; 
import { onRequest } from 'firebase-functions/v2/https';

let appInstance: Express | undefined;

onInit(async () => {
  validateEnv();
  const { default: app } = await import('./app.js'); 
  appInstance = app;
});

export const api = onRequest((req, res) => {
  if (!appInstance) {
    return res.status(503).send("Service Initializing...");
  }
  return appInstance(req, res);
});