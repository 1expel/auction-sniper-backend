import { Router } from 'express';
import { getAuthUrl, handleCallback, getUserHistory } from '../controllers/ebay-auth.controller';

const router = Router();

// Route to get the authorization URL
router.get('/auth-url', getAuthUrl);

// Route to handle the OAuth callback
router.get('/callback', handleCallback);

// Example route that uses user authorization
router.post('/user-history', getUserHistory);

export default router; 