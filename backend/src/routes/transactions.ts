import express, { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';

const router = express.Router();

// Fixes floating point errors
const roundToTwo = (num: number) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};

// 1. GET TRANSACTIONS
router.get('/', async (req: Request, res: Response) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ message: "Username required" });

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
    
    // Ensure amount is valid and rounded
    const cleanAmount = roundToTwo(parseFloat(amount));
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Round the result before saving
    user.balance = roundToTwo(user.balance + cleanAmount);
    await user.save();

    const newTxn = await Transaction.create({
      userId: username,
      type: 'credit',
      description: 'Wallet Recharge',
      amount: cleanAmount,
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

    // Ensure amount is valid and rounded
    const cleanAmount = roundToTwo(parseFloat(amount));
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check balance
    if (user.balance < cleanAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Round the result before saving
    user.balance = roundToTwo(user.balance - cleanAmount);
    await user.save();

    const newTxn = await Transaction.create({
      userId: username,
      type: 'debit',
      description: 'Withdrawal',
      amount: cleanAmount,
      status: 'success'
    });

    res.json({ balance: user.balance, transaction: newTxn });
  } catch (error) {
    res.status(500).json({ message: "Error withdrawing money" });
  }
});


export default router;
