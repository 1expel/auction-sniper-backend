import { Request, Response } from 'express';
import { ebayService } from '../services/ebay.service';

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
    
    // For now, just return the refresh token
    // In a real application, you would store this in your database
    res.json({ 
      success: true, 
      message: 'Successfully authorized with eBay',
      refresh_token // Note: In production, don't send this to the client
    });
  } catch (error) {
    console.error('Error handling callback:', error);
    res.status(500).json({ error: 'Failed to complete authorization' });
  }
};

/**
 * Example endpoint that uses user authorization
 */
export const getUserHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      res.status(400).json({ error: 'Refresh token is required' });
      return;
    }
    
    const history = await ebayService.getUserPurchaseHistory(refresh_token);
    res.json(history);
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({ error: 'Failed to fetch user history' });
  }
}; 