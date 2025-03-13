import { Router } from "express";
import { getListings } from "../controllers/ebay.controller";

const router = Router();

// GET /api/ebay/listings?q=search+term&limit=10
router.get("/listings", getListings);

export default router;
