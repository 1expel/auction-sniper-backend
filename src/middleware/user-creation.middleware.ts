import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';

/**
 * Simple middleware that creates a user in the database when they authenticate with Privy
 */
export const createUserOnAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Only proceed if we have user info from Privy auth
    if (!req.user || !req.user.privyUserId) {
      console.log('No user info available, skipping user creation');
      return next();
    }
    
    console.log('Attempting to create/verify user:', {
      privyUserId: req.user.privyUserId,
      hasEmail: !!req.user.email,
      hasWallet: !!req.user.walletAddress
    });
    
    // Create the user if they don't exist
    const result = await userService.createUserIfNotExists(
      req.user.privyUserId,
      req.user.email, // optional
      req.user.walletAddress // optional
    );
    
    if (result) {
      console.log('User creation/verification successful');
    } else {
      console.error('User creation/verification failed');
    }
    
    // Continue to next middleware
    next();
  } catch (error) {
    // Log error but don't stop the request
    console.error('Failed to create user:', error);
    next();
  }
}; 