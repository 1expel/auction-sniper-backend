import { Request, Response } from 'express';
import { createHash } from 'crypto';

export const AccountDeletion = (req: Request, res: Response) => { 

  const VERIFICATION_TOKEN = process.env.EBAY_VERIFICATION_TOKEN || '';  // Make sure to set this in your .env
  console.log("Received eBay account deletion notification:", req.query);
  console.log("Using VERIFICATION_TOKEN:", VERIFICATION_TOKEN);
  console.log("Received Path:", req.path);

  if (!req.query.challenge_code) { 
    console.error("No challenge_code received from eBay");
    res.status(400).json({ error: "Missing challenge_code" });
    return;
  }

  const challengeCode = req.query.challenge_code as string;

  // 🔥 Correct hashing
  const hash = createHash("sha256");
  hash.update(challengeCode);
  hash.update(VERIFICATION_TOKEN);  
  hash.update(req.path);  
  const responseHash = hash.digest("hex");  // ✅ Keep it as HEX

  console.log("Computed challengeResponse:", responseHash);

  // ✅ Send response directly
  res.status(200).json({ challengeResponse: responseHash });
  return;
  
}
