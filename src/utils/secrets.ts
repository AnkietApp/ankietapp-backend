import fs from 'fs';
import dotenv from 'dotenv';

if (fs.existsSync('.env')) {
  console.log('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
} else {
  dotenv.config({ path: '.env.example' });
}

export const JWT_SECRET = process.env.JWT_SECRET || 'somesecrettoken';

export const MAILGUN_API_KEY = String(process.env.MAILGUN_API_KEY);
export const MAILGUN_DOMAIN = String(process.env.MAILGUN_DOMAIN);
