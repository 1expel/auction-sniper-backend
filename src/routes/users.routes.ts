import { Router } from 'express';
import { AccountDeletion } from '../controllers/users.controller';

const router = Router();

router.get("/ebay-account-deletion", AccountDeletion);
router.post("/ebay-account-deletion", AccountDeletion);

export default router;
