import EbayAuthToken from 'ebay-oauth-nodejs-client';
import axios from 'axios';
import { EBAY_CONFIG } from '../config/ebay.config';
import { 
  SearchListingsParams, 
  EbaySearchResponse, 
  POKEMON_CARD_ASPECTS,
  AspectFilter,
  AspectFilters
} from '../types/ebay.types';

// Interface for aspect filter
// interface AspectFilter {
//   aspectName: string;
//   aspectValues: readonly string[];
// }

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
        offset: params.offset || 0,
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

      // Add aspect filters if provided
      if (params.aspectFilters) {
        const { professionalGrader, grades, specialty } = params.aspectFilters;

        if (professionalGrader?.length) {
          filters.push({
            aspectName: POKEMON_CARD_ASPECTS.PROFESSIONAL_GRADER.name,
            aspectValues: professionalGrader
          });
        }

        if (grades?.length) {
          filters.push({
            aspectName: POKEMON_CARD_ASPECTS.GRADE.name,
            aspectValues: grades
          });
        }

        if (specialty?.length) {
          filters.push({
            aspectName: POKEMON_CARD_ASPECTS.SPECIALTY.name,
            aspectValues: specialty
          });
        }
      }

      // Add aspect filters to search params if we have any
      if (filters.length > 0) {
        searchParams.aspect_filter = this.formatAspectFilter(filters, categoryId);
      }

      // Add standard filters if provided
      if (params.filters) {
        const filterParts: string[] = [];
        
        // Add buying options filter
        if (params.filters.buyingOptions?.length) {
          filterParts.push(`buyingOptions:{${params.filters.buyingOptions.join('|')}}`);
        }
        
        // Add price range filter
        if (params.filters.priceMin !== undefined || params.filters.priceMax !== undefined) {
          const min = params.filters.priceMin !== undefined ? params.filters.priceMin : '';
          const max = params.filters.priceMax !== undefined ? params.filters.priceMax : '';
          filterParts.push(`price:[${min}..${max}]`);
        }
        
        // Add filter parameter if we have any filters
        if (filterParts.length > 0) {
          searchParams.filter = filterParts.join(',');
        }
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
