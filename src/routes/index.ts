import { Router } from "express";
import usersRoutes from "./users.routes";
import ebayAuthRoutes from "./ebay-auth.routes"
import ebayRoutes from "./ebay.routes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/ebay/auth", ebayAuthRoutes);
router.use("/ebay", ebayRoutes);

export default router;
