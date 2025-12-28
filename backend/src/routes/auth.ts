import express, { Request, Response } from 'express';
import { User } from '../models/User';

const router = express.Router();

// REGISTER ROUTE
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, dob } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({ name, username, email, password, dob });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// LOGIN ROUTE
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password (simple comparison for now)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Return the user data
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;