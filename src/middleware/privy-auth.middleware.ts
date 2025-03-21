import { Request, Response, NextFunction } from 'express';
import { PrivyClient } from '@privy-io/server-auth';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
// Extended request interface to include the user
declare global {
  namespace Express {
    interface Request {
      user?: {
        privyUserId: string;
        email?: string;
        walletAddress?: string;
        [key: string]: any;
      };
    }
  }
}

// Initialize Privy client with appId and appSecret as separate arguments
const privy = new PrivyClient(
  process.env.PRIVY_APP_ID || '',
  process.env.PRIVY_APP_SECRET || ''
);

/**
 * Middleware that attempts to verify Privy JWT tokens but allows requests without auth
 * This makes authentication optional for endpoints
 */
export const verifyPrivyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    // If no auth header, continue without authentication
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    try {
      // Verify the token using Privy SDK
      const verifiedClaims = await privy.verifyAuthToken(token);
      
      // Add the user to the request object
      req.user = {
        privyUserId: verifiedClaims.userId,
        // Add any additional claims that might be useful
        // These are optional and depend on what data Privy provides
      };
    } catch (tokenError) {
      // If token verification fails, just continue without authentication
      console.error('Token verification failed:', tokenError);
    }
    
    // Continue to the next middleware
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    // Continue without authentication on error
    next();
  }
};

/**
 * Middleware to require authentication
 * Use this on routes that should be protected
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
};
