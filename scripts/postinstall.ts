#!/usr/bin/env tsx

/**
 * Postinstall Script for Shower Panel
 *
 * This script automatically runs after `yarn install` to check and create .env file.
 *
 * Functionality:
 * - Checks if .env file exists in project root
 * - If not exists, creates .env file with required environment variables
 * - Generates random SHOWER_CRYPT_SECRET_KEY for encryption/decryption
 * - Provides friendly console output
 *
 * Workflow:
 * 1. Check if .env file exists in project root
 * 2. If .env file doesn't exist, create it automatically
 * 3. Generate random SHOWER_CRYPT_SECRET_KEY and add to .env file
 * 4. Provide friendly console output information
 *
 * Generated .env file content:
 * ```env
 * # Shower Panel Environment Variables
 * # Generated automatically on 2024-01-01T00:00:00.000Z
 *
 * # Cryptography secret key for encryption/decryption
 * SHOWER_CRYPT_SECRET_KEY=your_generated_secret_key_here
 *
 * # Add other environment variables below
 * # API_BASE_URL=https://api.example.com
 * # DATABASE_URL=your_database_url_here
 * ```
 *
 * Usage:
 * - Automatically runs after: yarn install, yarn add, yarn remove
 * - Manual execution: yarn tsx scripts/postinstall.ts
 *
 * Notes:
 * - Script is written in TypeScript following project coding standards
 * - Generated key length is 32 bytes (64 hex characters)
 * - Existing .env files will not be overwritten
 * - All error messages and logs are in English per project standards
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate a random string for SHOWER_CRYPT_SECRET_KEY
 * @param length - Length of the random string
 * @returns Random string
 */
function generateRandomString(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Check if .env file exists and create it if not
 */
function checkAndCreateEnvFile(): void {
  const envPath = path.join(__dirname, '..', '.env');

  try {
    // Check if .env file exists
    if (fs.existsSync(envPath)) {
      console.log('✅ .env file already exists');
      return;
    }

    // Generate random secret key
    const secretKey = generateRandomString(32);

    // Create .env file content
    const envContent = `# Shower Panel Environment Variables
# Generated automatically on ${new Date().toISOString()}

# Cryptography secret key for encryption/decryption
SHOWER_SHOWER_CRYPTO_SECRET_KEY=${secretKey}
`;

    // Write .env file
    fs.writeFileSync(envPath, envContent, 'utf8');

    console.log('✅ .env file created successfully');
    console.log('🔑 SHOWER_CRYPT_SECRET_KEY generated and added to .env file');
    console.log('📝 Please review and modify the .env file as needed for your environment');
  } catch (error) {
    console.error(
      '❌ Failed to create .env file:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    process.exit(1);
  }
}

// Run the check and create function
checkAndCreateEnvFile();
