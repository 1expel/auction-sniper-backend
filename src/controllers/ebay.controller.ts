import { Request, Response } from "express";
import { ebayService } from '../services/ebay.service';

// https://api.ebay.com/buy/browse/v1/item_summary/search?q=laptops&limit=3

// Authorization: Include your OAuth token.
// X-EBAY-C-MARKETPLACE-ID: Specify the eBay marketplace ID (e.g., EBAY-US).

export const getListings = async (req: Request, res: Response) => {
  try {
    const query = req.query.q;
    if (!query) { res.status(400).json({ error: 'Search query required' }); return; }
    const results = await ebayService.searchListings(query);
    res.json(results);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch listings' });
    return;
  }
};
