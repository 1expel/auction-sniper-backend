import EbayAuthToken from 'ebay-oauth-nodejs-client';
import axios from 'axios';
import { EBAY_CONFIG } from '../config/ebay.config';

class EbayService {

  private authClient: EbayAuthToken;

  constructor() {
    this.authClient = new EbayAuthToken({
      clientId: EBAY_CONFIG.CLIENT_ID,
      clientSecret: EBAY_CONFIG.CLIENT_SECRET
    });
  }

  public async getAccessToken(): Promise<string> {
    try {
      const response = await this.authClient.getApplicationToken(
        EBAY_CONFIG.ENVIRONMENT,
        EBAY_CONFIG.SCOPES.join(' ')
      );
      const { access_token } = JSON.parse(response);
      return access_token;
    } catch (error) {
      console.error('Failed to get eBay access token:', error);
      throw new Error('Failed to authenticate with eBay');
    }
  }

  // --- api calls ---

  public async searchListings(query: string) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get(`${EBAY_CONFIG.BASE_URL}/buy/browse/v1/item_summary/search`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        params: { q: query, limit: 10 }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search eBay listings:', error);
      throw error;
    }
  }

}

// Export a singleton instance
export const ebayService = new EbayService();

//! add later
// Removes all the complexity around:
// Token caching
// Token refresh
// Expiry tracking
// Axios instance management
