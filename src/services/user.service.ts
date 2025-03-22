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
        const newUser = await prisma.profiles.create({
          data: {
            privy_id: privyId,
            email,
            wallet_address: walletAddress
          }
        });
        console.log(`user.service.ts -> New account created for ${privyId}`);
      } else {
        console.log(`user.service.ts -> User ${privyId} already exists in database`);
      }
      
      return true;
    } catch (error) {
      console.error('user.service.ts -> Database error:', error);
      return false;
    }
  }

  /**
   * Store eBay refresh token for a user
   * Pass null to clear the token (disconnect)
   */
  async storeEbayToken(privyId: string, refreshToken: string | null) {
    try {
      await prisma.profiles.update({
        where: { privy_id: privyId },
        data: { ebay_refresh_token: refreshToken }
      });
      
      if (refreshToken) {
        console.log(`user.service.ts -> eBay token stored for user ${privyId}`);
      } else {
        console.log(`user.service.ts -> eBay token removed for user ${privyId}`);
      }
      
      return true;
    } catch (error) {
      console.error('user.service.ts -> Failed to update eBay token:', error);
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
      
      const hasToken = !!profile?.ebay_refresh_token;
      console.log(`user.service.ts -> eBay connection for ${privyId}: ${hasToken ? 'Connected' : 'Not connected'}`);
      return profile?.ebay_refresh_token || null;
    } catch (error) {
      console.error('user.service.ts -> Error checking eBay connection:', error);
      return null;
    }
  }
}

export const userService = new UserService();