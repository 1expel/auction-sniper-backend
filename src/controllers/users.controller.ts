import { Request, Response } from 'express';

export const AccountDeletion = (req: Request, res: Response) => { 
  console.log("Received eBay account deletion notification:", req.body);
  res.sendStatus(200);
}
