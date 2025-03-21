import { Router } from 'express';
import { getAuthUrl, handleCallback, getUserHistory } from '../controllers/ebay-auth.controller';
import { requireAuth } from '../middleware/privy-auth.middleware';
import { userService } from '../services/user.service';

const router = Router();

// Route to get the authorization URL (no auth required)
router.get('/auth-url', getAuthUrl);

// Route to handle the OAuth callback (no auth required initially)
router.get('/callback', handleCallback);

// Route to check if user is connected to eBay
router.get('/connection-status', requireAuth, async (req, res) => {
  try {
    // Get the user's eBay token
    const refreshToken = await userService.getEbayToken(req.user!.privyUserId);
    
    // Return whether they're connected
    res.json({ connected: !!refreshToken });
  } catch (error) {
    console.error('Error checking connection status:', error);
    res.status(500).json({ error: 'Failed to check eBay connection status' });
  }
});

// Route to get user's eBay history (auth required)
router.get('/user-history', requireAuth, getUserHistory);

export default router; 