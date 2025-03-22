import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';

/**
 * Simple middleware that creates a user in the database when they authenticate with Privy
 */
export const createUserOnAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Only proceed if we have user info from Privy auth
    if (!req.user || !req.user.privyUserId) {
      // Silent - no need to log every unauthenticated request
      return next();
    }
    
    // Minimal log for authenticated users
    console.log(`auth.middleware.ts -> Verified Privy user: ${req.user.privyUserId}`);
    
    // Create the user if they don't exist
    await userService.createUserIfNotExists(
      req.user.privyUserId,
      req.user.email,
      req.user.walletAddress
    );
    
    // Continue to next middleware
    next();
  } catch (error) {
    // Log error but don't stop the request
    console.error('auth.middleware.ts -> User creation error:', error);
    next();
  }
}; 