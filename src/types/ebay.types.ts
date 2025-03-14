// Basic price type used in multiple places
interface Price {
  value: string;
  currency: string;
  convertedFromValue?: string;
  convertedFromCurrency?: string;
}

// Image type used in multiple places
interface Image {
  imageUrl: string;
  height?: number;
  width?: number;
}

// Seller information
interface Seller {
  username: string;
  feedbackScore: number;
  feedbackPercentage: string;
}

// Shipping option
interface ShippingOption {
  shippingCost: Price;
  shippingCostType: string;
  minEstimatedDeliveryDate?: string;
  maxEstimatedDeliveryDate?: string;
}

// Individual item in search results
export interface EbayItemSummary {
  itemId: string;
  title: string;
  shortDescription?: string;
  price: Price;
  currentBidPrice?: Price;
  bidCount?: number;
  buyingOptions: string[];  // e.g., "AUCTION", "FIXED_PRICE"
  condition: string;
  conditionId: string;
  itemWebUrl: string;
  itemEndDate?: string;
  image?: Image;
  thumbnailImages?: Image[];
  seller: Seller;
  shippingOptions?: ShippingOption[];
  watchCount?: number;
}

// Main search response
export interface EbaySearchResponse {
  total: number;
  itemSummaries: EbayItemSummary[];
  limit: number;
  offset: number;
  next?: string;  // URL for next page
  prev?: string;  // URL for previous page
}

// Search parameters
export interface SearchListingsParams {
  query: string;
  limit?: number;
  filter?: string;
  sort?: string;
} 