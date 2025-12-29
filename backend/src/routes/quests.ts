import express, { Request, Response } from 'express';
import { Quest } from '../models/Quest';
import { User } from '../models/User';
import { Message } from '../models/Message';
import { Transaction } from '../models/Transaction'; // Ensure this model exists

const router = express.Router();

// 1. GET ALL QUESTS (Except Expired)
// Used by Dashboard (shows active/completed) and Feed (filtered on frontend)
router.get('/', async (req: Request, res: Response) => {
  try {
    // Get the username of the person asking (passed from frontend)
    const currentUsername = req.query.username as string;

    const quests = await Quest.find({ status: { $ne: 'expired' } }).sort({ createdAt: -1 });
    
    // SANITIZE: Only show OTP if the user is the POSTER
    const sanitizedQuests = quests.map(q => {
      const quest = q.toObject();
      if (quest.postedBy !== currentUsername) {
        delete quest.otp; // <--- NUKE THE OTP FOR EVERYONE ELSE
      }
      return quest;
    });

    res.json(sanitizedQuests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quests" });
  }
});

// 2. POST A NEW QUEST (With Transaction)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, reward, xp, urgency, location, deadline, deadlineIso, postedBy } = req.body;

    const user = await User.findOne({ username: postedBy });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.balance < reward) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct Balance
    user.balance -= reward;
    await user.save();

    // RECORD TRANSACTION (Debit)
    await Transaction.create({
        userId: user.username,
        type: 'debit',
        description: `Escrow: ${title}`,
        amount: reward,
        status: 'success'
    });

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

// 3. ACCEPT QUEST ROUTE
router.put('/:id/accept', async (req: Request, res: Response) => {
  try {
    const { heroUsername } = req.body;
    const quest = await Quest.findById(req.params.id);

    if (!quest) return res.status(404).json({ message: "Quest not found" });

    if (quest.status !== 'open') {
      return res.status(400).json({ message: "Quest is no longer available" });
    }

    if (quest.postedBy === heroUsername) {
      return res.status(403).json({ message: "You cannot accept your own quest!" });
    }

    quest.status = 'active';
    quest.assignedTo = heroUsername;
    await quest.save();

    res.json({ message: "Quest accepted!", quest });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 4. COMPLETE QUEST ROUTE (With Transaction)
router.post('/:id/complete', async (req: Request, res: Response) => {
  try {
    const { otp, heroUsername } = req.body;
    const quest = await Quest.findById(req.params.id);

    if (!quest) return res.status(404).json({ message: "Quest not found" });

    if (quest.status !== 'active') return res.status(400).json({ message: "Quest is not active" });
    if (quest.assignedTo !== heroUsername) return res.status(403).json({ message: "You are not the assigned hero" });
    if (quest.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    // PAY THE HERO
    const hero = await User.findOne({ username: heroUsername });
    if (hero) {
      hero.balance += quest.reward;
      hero.xp += quest.xp;
      await hero.save();

      // RECORD TRANSACTION (Credit)
      await Transaction.create({
        userId: hero.username,
        type: 'credit',
        description: `Reward: ${quest.title}`,
        amount: quest.reward,
        status: 'success'
      });
    }

    quest.status = 'completed';
    await quest.save();

    res.json({ message: "Quest completed! Funds transferred." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 5. RESIGN QUEST (Hero gives up)
router.put('/:id/resign', async (req: Request, res: Response) => {
  try {
    const { heroUsername } = req.body;
    const quest = await Quest.findById(req.params.id);

    if (!quest) return res.status(404).json({ message: "Quest not found" });
    if (quest.assignedTo !== heroUsername) return res.status(403).json({ message: "Not assigned to you" });

    quest.status = 'open';
    quest.assignedTo = null;
    await quest.save();

    res.json({ message: "Quest resigned." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 6. CANCEL QUEST (Task Master cancels -> Refund)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const quest = await Quest.findById(req.params.id);

    if (!quest) return res.status(404).json({ message: "Quest not found" });
    if (quest.postedBy !== username) return res.status(403).json({ message: "Not your quest" });
    if (quest.status !== 'open') return res.status(400).json({ message: "Cannot cancel active quest" });

    // REFUND
    const user = await User.findOne({ username });
    if (user) {
      user.balance += quest.reward;
      await user.save();

      // RECORD TRANSACTION (Refund)
      await Transaction.create({
        userId: user.username,
        type: 'credit',
        description: `Refund: ${quest.title} (Cancelled)`,
        amount: quest.reward,
        status: 'success'
      });
    }

    await Quest.findByIdAndDelete(req.params.id);
    res.json({ message: "Quest cancelled & refunded." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 7. RATE HERO
router.post('/:id/rate', async (req: Request, res: Response) => {
  try {
    const { rating } = req.body;
    const quest = await Quest.findById(req.params.id);

    if (!quest || !quest.assignedTo) return res.status(404).json({ message: "Quest invalid" });
    if (quest.ratingGiven) return res.status(400).json({ message: "Already rated" });

    const hero = await User.findOne({ username: quest.assignedTo });
    if (hero) {
      const totalScore = (hero.rating * hero.ratingCount) + rating;
      hero.ratingCount += 1;
      hero.rating = parseFloat((totalScore / hero.ratingCount).toFixed(1));
      await hero.save();
    }

    quest.ratingGiven = true;
    await quest.save();

    res.json({ message: "Rating submitted", newRating: hero?.rating });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 8. SEND CHAT MESSAGE (Socket.io Upgrade)
router.post('/:id/messages', async (req: Request, res: Response) => {
  try {
    const { sender, text } = req.body;
    const newMessage = new Message({ questId: req.params.id, sender, text });
    await newMessage.save();

    // ⚡ BROADCAST TO SOCKET ROOM
    const io = req.app.get('io'); // Get the socket instance we saved in index.ts
    // Send to everyone in this 'quest room' (including the sender)
    io.to(req.params.id).emit('receive_message', {
        id: newMessage._id,
        text: newMessage.text,
        sender: sender, // We send raw username, frontend handles 'me' vs 'other'
        timestamp: newMessage.timestamp
    });

    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Error sending message" });
  }
});

// 9. GET CHAT MESSAGES
router.get('/:id/messages', async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({ questId: req.params.id }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});


export default router;
