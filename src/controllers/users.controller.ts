import { Request, Response } from 'express';

export const AccountDeletion = (req: Request, res: Response) => { 
  console.log("Received eBay account deletion notification:", req.body);
  res.status(200).json({ message: "ok" });
}

export const AccountDeletion2 = (req: Request, res: Response) => { 
  console.log("Received eBay account deletion notification:", req.query);
  res.status(200).json({ message: "ok" });
}
