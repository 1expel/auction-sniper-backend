import { Router } from "express";
import { getListings } from "../controllers/ebay.controller";

const router = Router();

router.get("/listings", getListings);

export default router;
