import express, { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';

const router = express.Router();

// 1. GET TRANSACTIONS
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

// 2. ADD MONEY (Wallet Recharge)
router.post('/add', async (req: Request, res: Response) => {
  try {
    const { username, amount } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.balance += amount;
    await user.save();

    const newTxn = await Transaction.create({
      userId: username,
      type: 'credit',
      description: 'Wallet Recharge',
      amount: amount,
      status: 'success'
    });

    res.json({ balance: user.balance, transaction: newTxn });
  } catch (error) {
    res.status(500).json({ message: "Error adding money" });
  }
});

// 3. WITHDRAW MONEY
router.post('/withdraw', async (req: Request, res: Response) => {
  try {
    const { username, amount } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.balance -= amount;
    await user.save();

    const newTxn = await Transaction.create({
      userId: username,
      type: 'debit',
      description: 'Withdrawal',
      amount: amount,
      status: 'success'
    });

    res.json({ balance: user.balance, transaction: newTxn });
  } catch (error) {
    res.status(500).json({ message: "Error withdrawing money" });
  }
});

export default router;
