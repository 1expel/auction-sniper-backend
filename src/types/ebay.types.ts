export interface EbayItemSummary {
  itemId: string;
  title: string;
  price: {
    value: string;
    currency: string;
  };
  currentBidPrice?: {
    value: string;
    currency: string;
  };
  seller: {
    username: string;
    feedbackScore: number;
  };
  condition: string;
  thumbnailImages?: { imageUrl: string }[];
  buyingOptions: string[];
  itemWebUrl: string;
  bidCount?: number;
  timeLeft?: string;
}

export interface EbaySearchResponse {
  total: number;
  itemSummaries: EbayItemSummary[];
  limit: number;
  offset: number;
}

export interface SearchListingsParams {
  query: string;
  limit?: number;
  filter?: string;
  sort?: string;
} 