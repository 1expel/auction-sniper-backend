

import { Request, Response } from "express";
import { createHash } from "crypto";


export const AccountDeletion = (req: Request, res: Response) => { 

  const VERIFICATION_TOKEN = process.env.EBAY_VERIFICATION_TOKEN || "default_token"; 
  console.log("Received eBay request:", req.method, req.query, req.body);
  console.log("Using VERIFICATION_TOKEN:", VERIFICATION_TOKEN);
  console.log("Received Path:", req.path);

  if (req.method === "GET") {
    if (!req.query.challenge_code) {
      console.error("No challenge_code received from eBay");
      res.status(400).json({ error: "Missing challenge_code" });
      return 
    }

    const challengeCode = req.query.challenge_code as string;

    // 🔥 Correct hashing
    const hash = createHash("sha256");
    hash.update(challengeCode);
    hash.update(VERIFICATION_TOKEN);  
    hash.update("https://auction-sniper-backend-production.up.railway.app/api/users/ebay-account-deletion");  
    const responseHash = hash.digest("hex");  // ✅ Keep it as HEX

    console.log("Computed challengeResponse:", responseHash);

    // ✅ Send response directly
    res.status(200).json({ challengeResponse: responseHash });
    return 
  }

  if (req.method === "POST") {
    console.log("Received eBay account deletion POST:", req.body);
    
    // ✅ You can process the deletion notification here
    res.status(200).json({ message: "Account deletion received" });
    return 
  }

  // If request is not GET or POST, return an error
  res.status(405).json({ error: "Method Not Allowed" });
  return 
};
