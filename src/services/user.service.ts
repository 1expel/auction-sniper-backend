import prisma from '../lib/prisma';

class UserService {
  /**
   * Create a user if they don't exist already
   */
  async createUserIfNotExists(privyId: string, email?: string, walletAddress?: string) {
    console.log(`Attempting to create user with privy_id: ${privyId}`, {
      hasEmail: !!email,
      hasWalletAddress: !!walletAddress
    });
    
    try {
      // Check if user exists
      console.log('Checking if user exists...');
      const existingUser = await prisma.profiles.findUnique({
        where: { privy_id: privyId }
      });

      // If user doesn't exist, create them
      if (!existingUser) {
        console.log('User not found, creating new user...');
        const newUser = await prisma.profiles.create({
          data: {
            privy_id: privyId,
            email,
            wallet_address: walletAddress
          }
        });
        console.log(`Created new user:`, newUser);
      } else {
        console.log('User already exists:', existingUser);
      }
      
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  }

  /**
   * Store eBay refresh token for a user
   */
  async storeEbayToken(privyId: string, refreshToken: string) {
    try {
      console.log(`Storing eBay token for user with privy_id: ${privyId}`);
      const updatedUser = await prisma.profiles.update({
        where: { privy_id: privyId },
        data: { ebay_refresh_token: refreshToken }
      });
      console.log('Updated user with eBay token:', updatedUser);
      return true;
    } catch (error) {
      console.error('Error storing eBay token:', error);
      return false;
    }
  }

  /**
   * Get a user's eBay refresh token
   */
  async getEbayToken(privyId: string) {
    try {
      console.log(`Getting eBay token for user with privy_id: ${privyId}`);
      const profile = await prisma.profiles.findUnique({
        where: { privy_id: privyId },
        select: { ebay_refresh_token: true }
      });
      
      console.log('Found profile with token:', !!profile?.ebay_refresh_token);
      return profile?.ebay_refresh_token || null;
    } catch (error) {
      console.error('Error getting eBay token:', error);
      return null;
    }
  }
}

export const userService = new UserService(); 