import express, { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ message: "Username required" });

    // Fetch transactions from DB, newest first
    const transactions = await Transaction.find({ userId: username }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;