import express, { Request, Response } from 'express';
import { Quest } from '../models/Quest';
import { User } from '../models/User';

const router = express.Router();

// 1. GET OPEN QUESTS (Fixed: Only show 'open' quests)
router.get('/', async (req: Request, res: Response) => {
  try {
    // FIX: Changed from { status: { $ne: 'completed' } } to { status: 'open' }
    // This prevents 'active' (already taken) or 'expired' quests from clogging the feed.
    const quests = await Quest.find({ status: 'open' }).sort({ createdAt: -1 });
    res.json(quests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quests" });
  }
});

// 2. POST A NEW QUEST (Unchanged)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, reward, xp, urgency, location, deadline, deadlineIso, postedBy } = req.body;

    const user = await User.findOne({ username: postedBy });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.balance < reward) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.balance -= reward;
    await user.save();

    const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
    
    const newQuest = new Quest({
      title,
      description,
      reward,
      xp,
      urgency,
      location,
      deadline,
      deadlineIso,
      postedBy,
      status: 'open',
      otp: generatedOTP
    });

    await newQuest.save();
    res.status(201).json(newQuest);
  } catch (error) {
    res.status(500).json({ message: "Error creating quest" });
  }
});

// 3. ACCEPT QUEST ROUTE (New!)
// This was missing! This is why you could accept your own quest.
router.put('/:id/accept', async (req: Request, res: Response) => {
  try {
    const { heroUsername } = req.body; // The Hero accepting the quest
    const quest = await Quest.findById(req.params.id);

    if (!quest) return res.status(404).json({ message: "Quest not found" });

    // CHECK: Is the quest already taken?
    if (quest.status !== 'open') {
      return res.status(400).json({ message: "Quest is no longer available" });
    }

    // CHECK: Prevent Self-Acceptance
    if (quest.postedBy === heroUsername) {
      return res.status(403).json({ message: "You cannot accept your own quest!" });
    }

    // Update Status
    quest.status = 'active';
    quest.assignedTo = heroUsername;
    await quest.save();

    res.json({ message: "Quest accepted!", quest });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 4. COMPLETE QUEST ROUTE (New!)
// This handles checking OTP and paying the Hero
router.post('/:id/complete', async (req: Request, res: Response) => {
  try {
    const { otp, heroUsername } = req.body;
    const quest = await Quest.findById(req.params.id);

    if (!quest) return res.status(404).json({ message: "Quest not found" });

    // Validate Status
    if (quest.status !== 'active') {
      return res.status(400).json({ message: "Quest is not active" });
    }

    // Validate Hero
    if (quest.assignedTo !== heroUsername) {
      return res.status(403).json({ message: "You are not the assigned hero" });
    }

    // Validate OTP
    if (quest.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // PAY THE HERO
    const hero = await User.findOne({ username: heroUsername });
    if (hero) {
      hero.balance += quest.reward;
      hero.xp += quest.xp;
      await hero.save();
    }

    // Mark Complete
    quest.status = 'completed';
    await quest.save();

    res.json({ message: "Quest completed! Funds transferred." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;