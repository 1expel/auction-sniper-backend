import EbayAuthToken from 'ebay-oauth-nodejs-client';
import axios from 'axios';
import { EBAY_CONFIG } from '../config/ebay.config';
import { 
  SearchListingsParams, 
  EbaySearchResponse, 
  POKEMON_CARD_ASPECTS
} from '../types/ebay.types';

// Interface for aspect filter
interface AspectFilter {
  aspectName: string;
  aspectValues: readonly string[];
}

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

  private formatAspectFilter(filters: AspectFilter[], categoryId: string): string {
    // Format: categoryId:123,aspectName1:{value1|value2},aspectName2:{value1}
    const parts = [`categoryId:${categoryId}`];
    
    for (const filter of filters) {
      // Join values with pipe and escape any pipes within values
      const values = filter.aspectValues
        .map(v => v.replace('|', '\\|'))
        .join('|');
      parts.push(`${filter.aspectName}:{${values}}`);
    }

    return parts.join(',');
  }

  // get token. use token to search.
  public async searchListings(params: SearchListingsParams): Promise<EbaySearchResponse> {
    try {
      const client = await this.getApiClient();
      const categoryId = '183454'; // Pokemon Card Singles category
      
      // Build search parameters
      const searchParams: any = {
        category_ids: categoryId,
        limit: params.limit || 10,
      };

      // Only add query parameter if it's not empty
      if (params.query.trim()) {
        searchParams.q = `${params.query} pokemon card`;
      } else {
        searchParams.q = 'pokemon card';
      }

      // Build aspect filters
      const filters: AspectFilter[] = [];

      // Always include Card Type = Pokemon and Graded = Yes
      filters.push(
        {
          aspectName: POKEMON_CARD_ASPECTS.CARD_TYPE.name,
          aspectValues: POKEMON_CARD_ASPECTS.CARD_TYPE.values
        },
        {
          aspectName: POKEMON_CARD_ASPECTS.GRADED.name,
          aspectValues: POKEMON_CARD_ASPECTS.GRADED.values
        }
      );

      // Add professional grader filter if specified
      if (params.professionalGrader?.length) {
        filters.push({
          aspectName: POKEMON_CARD_ASPECTS.PROFESSIONAL_GRADER.name,
          aspectValues: params.professionalGrader
        });
      }

      // Add grades filter if specified
      if (params.grades?.length) {
        filters.push({
          aspectName: POKEMON_CARD_ASPECTS.GRADE.name,
          aspectValues: params.grades
        });
      }

      // Add specialty filter if specified
      if (params.specialty?.length) {
        filters.push({
          aspectName: POKEMON_CARD_ASPECTS.SPECIALTY.name,
          aspectValues: params.specialty
        });
      }

      // Add aspect filters to search params if we have any
      if (filters.length > 0) {
        // Format aspect filter as a string instead of JSON
        searchParams.aspect_filter = this.formatAspectFilter(filters, categoryId);
      }

      console.log('Search params:', searchParams);

      const searchResponse = await client.get(`/buy/browse/v1/item_summary/search`, { 
        params: searchParams 
      });
      
      return searchResponse.data;
    } catch (error) {
      console.error('eBay API error:', error);
      throw error;
    }
  }
}

export const ebayService = new EbayService();
