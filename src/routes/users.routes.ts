import { Router } from 'express';
import type { RequestHandler } from 'express';
import { AccountDeletion } from '../controllers/users.controller';

const router = Router();

router.get("/ebay-account-deletion", AccountDeletion);

export default router;
