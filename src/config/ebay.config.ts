import dotenv from 'dotenv';
dotenv.config();

if (!process.env.EBAY_PROD_APP_ID) throw new Error('EBAY_PROD_APP_ID is required');
if (!process.env.EBAY_PROD_CERT_ID) throw new Error('EBAY_PROD_CERT_ID is required');

export const EBAY_CONFIG = {
  ENVIRONMENT: 'PRODUCTION',
  BASE_URL: process.env.EBAY_PROD_BASE_URL || 'https://api.ebay.com',
  CLIENT_ID: process.env.EBAY_PROD_APP_ID,
  CLIENT_SECRET: process.env.EBAY_PROD_CERT_ID,
  REDIRECT_URI: process.env.EBAY_REDIRECT_URI || 'http://localhost:3000/api/ebay/auth/callback',
  SCOPES: ['https://api.ebay.com/oauth/api_scope'] // Only public data scope for now
} as const; 
