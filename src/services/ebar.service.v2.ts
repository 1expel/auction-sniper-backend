import EbayAuthToken from 'ebay-oauth-nodejs-client';
import axios, { AxiosInstance } from 'axios';
import { EBAY_CONFIG } from '../config/ebay.config';

class EbayService {
  private authClient: typeof EbayAuthToken;
  private apiClient: AxiosInstance | null = null;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    // Initialize the auth client
    this.authClient = new EbayAuthToken({
      clientId: EBAY_CONFIG.CLIENT_ID,
      clientSecret: EBAY_CONFIG.CLIENT_SECRET,
      // redirectUri is not needed for client credentials flow
    });
  }

  private async refreshAccessToken(): Promise<void> {
    try {
      const response = await this.authClient.getApplicationToken(
        EBAY_CONFIG.ENVIRONMENT,
        EBAY_CONFIG.SCOPES.join(' ')
      );

      const { access_token, expires_in } = JSON.parse(response);
      
      this.accessToken = access_token;
      // Set expiry to 5 minutes before actual expiry to be safe
      this.tokenExpiry = Date.now() + (expires_in - 300) * 1000;
      
      // Initialize or update API client with new token
      this.apiClient = axios.create({
        baseURL: EBAY_CONFIG.BASE_URL,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    } catch (error) {
      console.error('Failed to refresh eBay access token:', error);
      throw new Error('Failed to authenticate with eBay');
    }
  }

  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken || !this.tokenExpiry || Date.now() >= this.tokenExpiry) {
      await this.refreshAccessToken();
    }
  }

  public async getApiClient(): Promise<AxiosInstance> {
    await this.ensureValidToken();
    if (!this.apiClient) {
      throw new Error('API client not initialized');
    }
    return this.apiClient;
  }

  // Example method for getting eBay listings
  public async searchListings(query: string) {
    const client = await this.getApiClient();
    try {
      const response = await client.get('/buy/browse/v1/item_summary/search', {
        params: {
          q: query,
          limit: 10
        }
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