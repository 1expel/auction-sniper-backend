import { Router } from 'express';
import type { RequestHandler } from 'express';
import { AccountDeletion, AccountDeletion2 } from '../controllers/users.controller';

const router = Router();

router.post("/ebay-account-deletion", AccountDeletion);
router.get("/ebay-account-deletion", AccountDeletion2);

export default router;
