#!/usr/bin/env node

/* global console */
/**
 * Post-deploy script for Firebase Functions
 *
 * Restores the original package.json after deployment.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '..');

const packageJsonPath = path.join(backendRoot, 'package.json');
const backupPath = path.join(backendRoot, 'package.json.backup');

console.log('[Postdeploy] Restoring original package.json...');

if (fs.existsSync(backupPath)) {
  fs.copyFileSync(backupPath, packageJsonPath);
  fs.unlinkSync(backupPath);
  console.log('[Postdeploy] package.json restored successfully!');
} else {
  console.log('[Postdeploy] No backup found, skipping restore.');
}

console.log('[Postdeploy] Restoring pnpm-lock.yaml...');
const lockfilePath = path.join(backendRoot, 'pnpm-lock.yaml');
const lockfileBackupPath = path.join(backendRoot, 'pnpm-lock.yaml.backup');

if (fs.existsSync(lockfileBackupPath)) {
  // Restore original lockfile
  if (fs.existsSync(lockfilePath)) {
    fs.unlinkSync(lockfilePath); // Remove the one potentially created by Cloud Build (unlikely in local deploy) or just specific
  }
  fs.renameSync(lockfileBackupPath, lockfilePath);
  console.log('[Postdeploy] pnpm-lock.yaml restored successfully!');
}

// Clean up tarballs directory
const tarballsDir = path.join(backendRoot, '.tarballs');
if (fs.existsSync(tarballsDir)) {
  fs.rmSync(tarballsDir, { recursive: true, force: true });
  console.log('[Postdeploy] Cleaned up .tarballs directory.');
}

console.log('[Postdeploy] Post-deploy cleanup complete!');
