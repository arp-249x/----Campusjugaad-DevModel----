import express, { Request, Response } from 'express';
import { User } from '../models/User';
import { Otp } from '../models/Otp'; // Import OTP model
import nodemailer from 'nodemailer';


const router = express.Router();

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

// 1. SEND OTP ROUTE
router.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // 1. Check if User already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered. Please login." });
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Save to DB (Update if exists)
    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // 4. Send Email
    const mailOptions = {
      from: 'Campus Jugaad <noreply@campusjugaad.com>',
      to: email,
      subject: 'Your Verification Code',
      text: `Thank you for registering on Campus Jugaad. Time to save your campus! 

Your verification code is: ${otp}. 

It expires in 5 minutes.
⚠️ Do NOT share this OTP with anyone.`


    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("OTP Error:", error);
    res.status(500).json({ message: "Failed to send OTP. Check internet/email config." });
  }
});

// 2. REGISTER ROUTE (Modified to Verify OTP)
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, dob, otp } = req.body;

    // 1. Verify OTP
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 2. Double check user existence
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Create new user
    const newUser = new User({ 
      name, 
      username, 
      email, 
      password, 
      dob,
      balance: 450, 
      xp: 0,
      rating: 5.0,
      ratingCount: 0
    });
    
    await newUser.save();

    // 4. Delete used OTP
    await Otp.deleteOne({ email });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 3. LOGIN ROUTE
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.password !== password) return res.status(400).json({ message: "Invalid credentials" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 4. ME ROUTE
router.get('/me', async (req: Request, res: Response) => {
  try {
    const { username } = req.query; 
    if (!username || typeof username !== 'string') return res.status(400).json({ message: "Username required" });
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


export default router;

