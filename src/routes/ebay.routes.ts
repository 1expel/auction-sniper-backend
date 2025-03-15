import { Router } from "express";
import { getListings } from "../controllers/ebay.controller";

const router = Router();

// Only use POST for the listings endpoint
router.post("/listings", getListings);

export default router;
