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
  professionalGrader?: ProfessionalGrader[];
  grades?: Grade[];
  specialty?: Specialty[];
}

export const POKEMON_CARD_ASPECTS = {
  PROFESSIONAL_GRADER: {
    name: "Professional Grader",
    values: ["PSA", "BGS", "CGC", "ACE", "SGC"] as const
  },
  GRADE: {
    name: "Grade",
    values: ["10", "9.5", "9", "8.5", "8", "7"] as const
  },
  CARD_TYPE: {
    name: "Card Type",
    values: ["Pokémon"] as const
  },
  GRADED: {
    name: "Graded",
    values: ["Yes"] as const
  },
  SPECIALTY: {
    name: "Speciality", // Note eBay's spelling
    values: ["VMAX", "V", "GX", "EX", "BREAK", "LEGEND", "MEGA", "PRIME", "TAG TEAM"] as const
  }
} as const;

// Type for the aspect filter values
export type ProfessionalGrader = typeof POKEMON_CARD_ASPECTS.PROFESSIONAL_GRADER.values[number];
export type Grade = typeof POKEMON_CARD_ASPECTS.GRADE.values[number];
export type Specialty = typeof POKEMON_CARD_ASPECTS.SPECIALTY.values[number];

// Specific Pokemon card search params
export interface PokemonCardSearchParams extends SearchListingsParams {
  professionalGrader?: ProfessionalGrader[];
  grades?: Grade[];
  specialty?: Specialty[];
} 