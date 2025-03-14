import { Request, Response } from "express";
import { ebayService } from '../services/ebay.service';

// https://api.ebay.com/buy/browse/v1/item_summary/search?q=laptops&limit=3

// Authorization: Include your OAuth token.
// X-EBAY-C-MARKETPLACE-ID: Specify the eBay marketplace ID (e.g., EBAY-US).

export const getListings = async (req: Request, res: Response) => {
  try {
    const queryParam = req.query.q;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    // Validate and convert query parameter to string
    if (!queryParam || typeof queryParam !== 'string') { 
      res.status(400).json({ error: 'Search query required and must be a string' }); 
      return; 
    }

    // Search with validated parameters
    const results = await ebayService.searchListings({
      query: queryParam,
      limit
    });

    res.json(results);
    return;
  } catch (error) {
    console.error('Error in getListings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
    return;
  }
};
