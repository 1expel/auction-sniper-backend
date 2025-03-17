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

// Middleware to verify Privy JWT tokens
export const verifyPrivyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify the token using Privy SDK
    const verifiedClaims = await privy.verifyAuthToken(token);
    
    // Add the user to the request object
    req.user = {
      privyUserId: verifiedClaims.userId
    };
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to require authentication
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};
