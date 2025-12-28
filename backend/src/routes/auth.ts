import express, { Request, Response } from 'express';
import { User } from '../models/User';

const router = express.Router();

// 1. REGISTER ROUTE
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, dob } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    // Note: In a production app, password should be hashed here!
    const newUser = new User({ 
      name, 
      username, 
      email, 
      password, 
      dob,
      balance: 450, // Default starting balance
      xp: 0,
      rating: 5.0,
      ratingCount: 0
    });
    
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. LOGIN ROUTE
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password (simple comparison for MVP)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Return user data (excluding password ideally, but keeping it simple for now)
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 3. GET CURRENT USER DATA (Fixes Wallet Sync Issue)
// This is called by the frontend periodically to get fresh Balance/XP/Rating
router.get('/me', async (req: Request, res: Response) => {
  try {
    const { username } = req.query; // Pass ?username=...
    
    // Validate input
    if (!username || typeof username !== 'string') {
        return res.status(400).json({ message: "Username required" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user); // Returns fresh balance, rating, xp
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;