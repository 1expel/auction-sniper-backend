import prisma from '../lib/prisma';

class UserService {
  /**
   * Create a user if they don't exist already
   */
  async createUserIfNotExists(privyId: string, email?: string, walletAddress?: string) {
    try {
      // Check if user exists
      const existingUser = await prisma.profiles.findUnique({
        where: { privy_id: privyId }
      });

      // If user doesn't exist, create them
      if (!existingUser) {
        await prisma.profiles.create({
          data: {
            privy_id: privyId,
            email,
            wallet_address: walletAddress
          }
        });
        console.log(`Created new user with privy_id: ${privyId}`);
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
      await prisma.profiles.update({
        where: { privy_id: privyId },
        data: { ebay_refresh_token: refreshToken }
      });
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
      const profile = await prisma.profiles.findUnique({
        where: { privy_id: privyId },
        select: { ebay_refresh_token: true }
      });
      
      return profile?.ebay_refresh_token || null;
    } catch (error) {
      console.error('Error getting eBay token:', error);
      return null;
    }
  }
}

export const userService = new UserService(); 