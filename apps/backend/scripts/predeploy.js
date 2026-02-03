#!/usr/bin/env node

/* global console */
/**
 * Pre-deploy script for Firebase Functions
 *
 * This script bundles workspace dependencies into the backend
 * so that Firebase can deploy without workspace:* references.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '..');
const monorepoRoot = path.resolve(backendRoot, '../..');

const WORKSPACE_DEPS = ['@media-log/shared-types', '@media-log/shared-utils'];

console.log('[Predeploy] Starting pre-deploy preparation...');

// Step 1: Build shared packages
console.log('[Predeploy] Building shared packages...');
for (const dep of WORKSPACE_DEPS) {
  const pkgName = dep.replace('@media-log/', '');
  const pkgPath = path.join(monorepoRoot, 'packages', pkgName);

  if (fs.existsSync(pkgPath)) {
    console.log(`[Predeploy] Building ${dep}...`);
    try {
      execSync('pnpm build', { cwd: pkgPath, stdio: 'inherit' });
    } catch {
      console.warn(
        `[Predeploy] Warning: Build failed for ${dep}, continuing...`,
      );
    }
  }
}

// Step 2: Pack shared packages into tarballs
console.log('[Predeploy] Packing shared packages...');
const tarballsDir = path.join(backendRoot, '.tarballs');
if (!fs.existsSync(tarballsDir)) {
  fs.mkdirSync(tarballsDir, { recursive: true });
}

const tarballPaths = {};
for (const dep of WORKSPACE_DEPS) {
  const pkgName = dep.replace('@media-log/', '');
  const pkgPath = path.join(monorepoRoot, 'packages', pkgName);

  if (fs.existsSync(pkgPath)) {
    console.log(`[Predeploy] Packing ${dep}...`);
    try {
      // Run pnpm pack and capture output
      const result = execSync('pnpm pack --pack-destination ' + tarballsDir, {
        cwd: pkgPath,
        encoding: 'utf-8',
      });

      // Find the tarball file
      const tarballFile = result.trim().split('\n').pop();
      if (tarballFile) {
        tarballPaths[dep] = path
          .relative(backendRoot, tarballFile)
          .replace(/\\/g, '/');
        console.log(`[Predeploy] Created tarball: ${tarballPaths[dep]}`);
      }
    } catch (err) {
      console.error(`[Predeploy] Error packing ${dep}:`, err.message);
    }
  }
}

// Step 3: Update package.json to use file: references
console.log('[Predeploy] Updating package.json...');
const packageJsonPath = path.join(backendRoot, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// Backup original
const backupPath = path.join(backendRoot, 'package.json.backup');
fs.writeFileSync(backupPath, JSON.stringify(packageJson, null, 2));

// Update dependencies
for (const dep of WORKSPACE_DEPS) {
  if (tarballPaths[dep] && packageJson.dependencies?.[dep]) {
    packageJson.dependencies[dep] = `file:${tarballPaths[dep]}`;
    console.log(
      `[Predeploy] Updated ${dep} to ${packageJson.dependencies[dep]}`,
    );
  }
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('[Predeploy] Temporarily moving pnpm-lock.yaml to backup...');
const lockfilePath = path.join(backendRoot, 'pnpm-lock.yaml');
const lockfileBackupPath = path.join(backendRoot, 'pnpm-lock.yaml.backup');
if (fs.existsSync(lockfilePath)) {
  fs.renameSync(lockfilePath, lockfileBackupPath);
  console.log('[Predeploy] pnpm-lock.yaml moved to backup.');
}

console.log('[Predeploy] Pre-deploy preparation complete!');
console.log(
  '[Predeploy] Remember to restore package.json after deploy with: pnpm run postdeploy',
);
