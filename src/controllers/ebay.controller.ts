import { Request, Response } from "express";
import { ebay } from "../ebay";

// https://api.ebay.com/buy/browse/v1/item_summary/search?q=laptops&limit=3

// Authorization: Include your OAuth token.
// X-EBAY-C-MARKETPLACE-ID: Specify the eBay marketplace ID (e.g., EBAY-US).

export const getListings = async (req: Request, res: Response) => {
  try {
    const res = await ebay.get("/item_summary/search");
    console.log(res.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
