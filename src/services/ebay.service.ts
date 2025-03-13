import EbayAuthToken from 'ebay-oauth-nodejs-client';
import axios from 'axios';
import { EBAY_CONFIG } from '../config/ebay.config';

//! add later
// Removes all the complexity around:
// Token caching
// Token refresh
// Expiry tracking
// Axios instance management

class EbayService {

  private authClient;

  constructor() {
    this.authClient = new EbayAuthToken({ clientId: EBAY_CONFIG.CLIENT_ID, clientSecret: EBAY_CONFIG.CLIENT_SECRET });
  }

  // get token. use token to search.
  async searchListings(query: any) {
    try {
      const response = await this.authClient.getApplicationToken('PRODUCTION', 'https://api.ebay.com/oauth/api_scope');
      const { access_token } = JSON.parse(response);
      const searchResponse = await axios.get(`${EBAY_CONFIG.BASE_URL}/buy/browse/v1/item_summary/search`, {
        headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
        params: { q: query, limit: 10 }
      });
      return searchResponse.data;
    } catch (error) {
      console.error('eBay API error:', error);
      throw error;
    }
  }
}

export const ebayService = new EbayService();
