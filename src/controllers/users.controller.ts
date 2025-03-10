import { Request, Response } from 'express';
import { createHash } from 'crypto';

const VERIFICATION_TOKEN = process.env.EBAY_VERIFICATION_TOKEN || '';  // Make sure to set this in your .env

export const AccountDeletion = (req: Request, res: Response) => { 
  console.log("Received eBay account deletion notification:", req.body);
  
  if (req.body.challenge_code) {
    const hash = createHash('sha256');
    hash.update(req.body.challenge_code);
    hash.update(VERIFICATION_TOKEN);
    hash.update(req.path);
    const responseHash = hash.digest('hex');
    res.status(200).json({ challengeResponse: responseHash });
    return 
  }
  
  res.status(200).json({ message: "ok" });
  return;
}

export const AccountDeletion2 = (req: Request, res: Response) => { 
  console.log("Received eBay account deletion notification:", req.query);
  
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
