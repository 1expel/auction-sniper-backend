import { Request, Response } from "express";
import { ebayService } from "../services/ebay.service";
import { SearchListingsParams } from "../types/ebay.types";

// https://api.ebay.com/buy/browse/v1/item_summary/search?q=laptops&limit=3

// Authorization: Include your OAuth token.
// X-EBAY-C-MARKETPLACE-ID: Specify the eBay marketplace ID (e.g., EBAY-US).

export const getListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query = "", limit = 10, offset = 0, aspectFilters, filters } = req.body;
    
    // Validate query parameter
    if (typeof query !== "string") {
      res.status(400).json({ error: "Search query must be a string when provided" });
      return;
    }

    // Search with validated parameters
    const searchParams: SearchListingsParams = {
      query,
      limit: Number(limit),
      offset: Number(offset),
      aspectFilters,
      filters
    };

    const results = await ebayService.searchListings(searchParams);
    res.json(results);
  } catch (error) {
    console.error("Error in getListings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
