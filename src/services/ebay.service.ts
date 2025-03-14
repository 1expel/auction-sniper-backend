import EbayAuthToken from 'ebay-oauth-nodejs-client';
import axios from 'axios';
import { EBAY_CONFIG } from '../config/ebay.config';
import { SearchListingsParams, EbaySearchResponse } from '../types/ebay.types';

//! add later
// client credentials grant flow: DONE
// user authoirzation grant flow: 

class EbayService {

  private authClient;
  private apiClient;
  private accessToken;
  private tokenExpiry;

  constructor() {
    this.authClient = new EbayAuthToken({ clientId: EBAY_CONFIG.CLIENT_ID, clientSecret: EBAY_CONFIG.CLIENT_SECRET });
  }

  // if not initialized yet or token expired -> recreate axios api client.
  private async getApiClient() {
    console.log('\ngetting api client... ')
    if (!this.accessToken || !this.tokenExpiry || Date.now() >= this.tokenExpiry) {
      console.log(!this.accessToken ? '-> initializing apiClient' : '-> token expired at:' + new Date(this.tokenExpiry).toLocaleString())
      try {
        const res = await this.authClient.getApplicationToken('PRODUCTION', 'https://api.ebay.com/oauth/api_scope'); 
        const { access_token, expires_in } = JSON.parse(res);
        this.accessToken = access_token;
        this.tokenExpiry = Date.now() + (expires_in - 300) * 1000 // set expiry to 5 minutes before actual expiry to be safe.
        this.apiClient = axios.create({ 
          baseURL: EBAY_CONFIG.BASE_URL,
          headers: { 
            'Authorization': `Bearer ${access_token}`, 
            'Content-Type': 'application/json'
          }
        });
        console.log('-> new token will expire at:', new Date(this.tokenExpiry).toLocaleString());
        return this.apiClient;
      } catch (error) {
        console.error('Failed to refresh eBay access token:', error);
        throw new Error('Failed to authenticate with eBay');
      }
    } else {
      console.log('-> valid api client');
      return this.apiClient;
    }
  }

  // get token. use token to search.
  public async searchListings(params: SearchListingsParams): Promise<EbaySearchResponse> {
    try {
      const client = await this.getApiClient();
      // Build a more specific search query
      const searchParams = {
        q: `${params.query} pokemon card graded PSA BGS CGC`, // Include major grading companies
        category_ids: '183454', // Pokemon Card Singles category
        filter: [
          'conditionIds:{1000|2000|2500|3000|4000|5000}', // New to Used conditions
          'buyingOptions:{FIXED_PRICE|AUCTION}',
        ].join('|'),
        limit: params.limit || 10,
      };
      const searchResponse = await client.get(`/buy/browse/v1/item_summary/search`, { params: searchParams });
      return searchResponse.data;
    } catch (error) {
      console.error('eBay API error:', error);
      throw error;
    }
  }
}

export const ebayService = new EbayService();
