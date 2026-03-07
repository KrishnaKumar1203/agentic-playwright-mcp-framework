#!/usr/bin/env node

/**
 * Artifact Cleanup Script
 * Cleans up generated artifacts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTIFACTS_DIR = path.join(__dirname, '..', 'artifacts');

const DIRS_TO_CLEAN = [
  'resolved',
  'catalog',
  'vstp',
  'object-repository',
  'qa-gate',
  'reports',
  'logs',
];

function cleanArtifacts() {
  console.log('🧹 Cleaning artifacts...\n');

  DIRS_TO_CLEAN.forEach((dir) => {
    const dirPath = path.join(ARTIFACTS_DIR, dir);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        fs.unlinkSync(filePath);
        console.log(`🗑️  Deleted: ${filePath}`);
      });
    }
  });

  console.log('\n✅ Artifact cleanup complete!');
}

cleanArtifacts();
