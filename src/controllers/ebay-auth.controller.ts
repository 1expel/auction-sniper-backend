import { Request, Response } from 'express';
import { ebayService } from '../services/ebay.service';
import { userService } from '../services/user.service';

/**
 * Generate an eBay authorization URL
 */
export const getAuthUrl = (req: Request, res: Response): void => {
  try {
    // Generate a state parameter to verify the callback
    const state = Buffer.from(JSON.stringify({
      timestamp: Date.now()
    })).toString('base64');
    
    // Get the authorization URL
    const authUrl = ebayService.getAuthorizationUrl(state);
    
    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate authorization URL' });
  }
};

/**
 * Handle the eBay OAuth callback
 */
export const handleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, state } = req.query;
    
    if (!code || typeof code !== 'string') {
      res.status(400).json({ error: 'Missing authorization code' });
      return;
    }
    
    // Verify state parameter if needed
    if (state && typeof state === 'string') {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        const { timestamp } = stateData;
        
        // Check if the state is expired (e.g., older than 10 minutes)
        if (Date.now() - timestamp > 10 * 60 * 1000) {
          res.status(400).json({ error: 'Authorization request expired' });
          return;
        }
      } catch (e) {
        res.status(400).json({ error: 'Invalid state parameter' });
        return;
      }
    }
    
    // Exchange the code for tokens
    const { refresh_token } = await ebayService.handleAuthCallback(code);
    
    // If user is authenticated, store their eBay refresh token
    if (req.user && req.user.privyUserId) {
      await userService.storeEbayToken(req.user.privyUserId, refresh_token);
      
      // Return success without exposing the token
      res.json({ 
        success: true, 
        message: 'Successfully authorized with eBay',
        connected: true
      });
    } else {
      // If no user in context, still don't expose token
      // We need to handle this case better - either:
      // 1. Require authentication for this endpoint
      // 2. Use a session or some other mechanism
      console.warn('No authenticated user when processing eBay callback');
      
      res.json({ 
        success: false, 
        message: 'Authorization failed - no authenticated user',
        connected: false
      });
    }
  } catch (error) {
    console.error('Error handling callback:', error);
    res.status(500).json({ error: 'Failed to complete authorization' });
  }
};

/**
 * Get user's purchase history
 * 
 * NOTE: This endpoint will not work with the current scopes.
 * It requires a marketplace insights scope that is not in your available scopes.
 */
export const getUserHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.privyUserId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    const refreshToken = await userService.getEbayToken(req.user.privyUserId);
    
    // Ensure we have a token before calling the service
    if (!refreshToken) {
      res.status(400).json({ error: 'eBay connection not found' });
      return;
    }
    
    // This will likely fail due to insufficient scopes
    res.status(403).json({ 
      error: 'Insufficient permissions', 
      message: 'This endpoint requires additional eBay API scopes that are not currently available.'
    });
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({ error: 'Failed to fetch user history' });
  }
};

/**
 * Get user's eBay account information
 * 
 * This endpoint will work with the commerce.identity.readonly scope
 */
export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.privyUserId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    const refreshToken = await userService.getEbayToken(req.user.privyUserId);
    
    if (!refreshToken) {
      res.status(400).json({ error: 'eBay connection not found' });
      return;
    }
    
    const userInfo = await ebayService.getUserInfo(refreshToken);
    res.json(userInfo);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Failed to fetch user information' });
  }
};

/**
 * Get user's eBay watch list
 * 
 * NOTE: This endpoint will not work with the current scopes.
 * It requires the buy.my.ebay scope that is not in your available scopes.
 */
export const getUserWatchList = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.privyUserId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    const refreshToken = await userService.getEbayToken(req.user.privyUserId);
    
    if (!refreshToken) {
      res.status(400).json({ error: 'eBay connection not found' });
      return;
    }
    
    // This will likely fail due to insufficient scopes
    res.status(403).json({ 
      error: 'Insufficient permissions', 
      message: 'This endpoint requires additional eBay API scopes that are not currently available.'
    });
  } catch (error) {
    console.error('Error fetching watch list:', error);
    res.status(500).json({ error: 'Failed to fetch watch list' });
  }
};

/**
 * Add an item to user's watch list
 * 
 * NOTE: This endpoint will not work with the current scopes.
 * It requires the buy.my.ebay scope that is not in your available scopes.
 */
export const addToWatchList = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.privyUserId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    const { itemId } = req.body;
    
    if (!itemId) {
      res.status(400).json({ error: 'Item ID is required' });
      return;
    }
    
    const refreshToken = await userService.getEbayToken(req.user.privyUserId);
    
    if (!refreshToken) {
      res.status(400).json({ error: 'eBay connection not found' });
      return;
    }
    
    // This will likely fail due to insufficient scopes
    res.status(403).json({ 
      error: 'Insufficient permissions', 
      message: 'This endpoint requires additional eBay API scopes that are not currently available.'
    });
  } catch (error) {
    console.error('Error adding to watch list:', error);
    res.status(500).json({ error: 'Failed to add item to watch list' });
  }
}; 