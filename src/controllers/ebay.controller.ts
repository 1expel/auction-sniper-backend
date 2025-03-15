import { Request, Response } from "express";
import { ebayService } from '../services/ebay.service';
import { ProfessionalGrader, Grade, Specialty } from '../types/ebay.types';

// https://api.ebay.com/buy/browse/v1/item_summary/search?q=laptops&limit=3

// Authorization: Include your OAuth token.
// X-EBAY-C-MARKETPLACE-ID: Specify the eBay marketplace ID (e.g., EBAY-US).

export const getListings = async (req: Request, res: Response) => {
  try {
    const queryParam = req.query.query;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    
    // Parse professional graders if provided
    let professionalGrader: ProfessionalGrader[] | undefined;
    if (req.query.professionalGrader) {
      try {
        professionalGrader = JSON.parse(req.query.professionalGrader as string);
      } catch (e) {
        res.status(400).json({ error: 'Invalid professional grader format' });
        return;
      }
    }

    // Parse grades if provided
    let grades: Grade[] | undefined;
    if (req.query.grades) {
      try {
        grades = JSON.parse(req.query.grades as string);
      } catch (e) {
        res.status(400).json({ error: 'Invalid grades format' });
        return;
      }
    }

    // Parse specialty if provided
    let specialty: Specialty[] | undefined;
    if (req.query.specialty) {
      try {
        specialty = JSON.parse(req.query.specialty as string);
      } catch (e) {
        res.status(400).json({ error: 'Invalid specialty format' });
        return;
      }
    }

    // Validate and convert query parameter to string
    if (!queryParam || typeof queryParam !== 'string') { 
      res.status(400).json({ error: 'Search query required and must be a string' }); 
      return; 
    }

    // Search with validated parameters
    const results = await ebayService.searchListings({
      query: queryParam,
      limit,
      professionalGrader,
      grades,
      specialty
    });

    res.json(results);
  } catch (error) {
    console.error('Error in getListings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
