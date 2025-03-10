import { Request, Response } from 'express';
import { createHash } from 'crypto';

export const AccountDeletion = (req: Request, res: Response) => { 
  console.log("Received eBay account deletion notification:", req.query);
  const VERIFICATION_TOKEN = process.env.EBAY_VERIFICATION_TOKEN || '';  // Make sure to set this in your .env
  console.log('hello;', VERIFICATION_TOKEN);
  if (req.query.challenge_code) {
    const hash = createHash('sha256');
    hash.update(req.query.challenge_code as string);
    hash.update(VERIFICATION_TOKEN);
    hash.update(req.path);
    const responseHash = hash.digest('hex');
    res.status(200).json({ challengeResponse: responseHash });
    return 
  }
  res.status(200).json({ message: "ok" });
  return;
}
