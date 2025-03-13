import { Router } from "express";
import usersRoutes from "./users.routes";
import ebayRoutes from "./ebay.routes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/ebay", ebayRoutes);

export default router;
