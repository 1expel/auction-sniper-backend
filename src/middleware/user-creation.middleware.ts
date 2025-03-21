import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';

/**
 * Simple middleware that creates a user in the database when they authenticate with Privy
 */
export const createUserOnAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Only proceed if we have user info from Privy auth
    if (!req.user || !req.user.privyUserId) {
      return next();
    }
    
    // Create the user if they don't exist
    await userService.createUserIfNotExists(
      req.user.privyUserId,
      req.user.email, // optional
      req.user.walletAddress // optional
    );
    
    // Continue to next middleware
    next();
  } catch (error) {
    // Log error but don't stop the request
    console.error('Failed to create user:', error);
    next();
  }
}; 