import express, { Request, Response } from 'express';
import { Quest } from '../models/Quest';
import { User } from '../models/User';
import { Message } from '../models/Message';
import { Transaction } from '../models/Transaction';

const router = express.Router();

// 1. GET ALL QUESTS (Except Expired)
// Used by Dashboard and Feed
router.get('/', async (req: Request, res: Response) => {
  try {
    const currentUsername = req.query.username as string;
    const quests = await Quest.find({ status: { $ne: 'expired' } }).sort({ createdAt: -1 });
    
    //Only show OTP if the user is the TaskMaster
    const sanitizedQuests = quests.map(q => {
      const quest = q.toObject();
      if (quest.postedBy !== currentUsername) {
        delete quest.otp; 
      }
      return quest;
    });

    res.json(sanitizedQuests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quests" });
  }
});

// 2. POST A NEW QUEST (With Idempotency Check)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, reward, xp, urgency, location, deadline, deadlineIso, postedBy } = req.body;

    // Check if this user posted the exact same title within the last 10 seconds
    const tenSecondsAgo = new Date(Date.now() - 10000);
    const existingDuplicate = await Quest.findOne({
        postedBy,
        title,
        createdAt: { $gte: tenSecondsAgo }
    });

    if (existingDuplicate) {
        return res.status(429).json({ message: "You just posted this! Please wait." });
    }

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
      title, description, reward, xp, urgency, location, deadline, deadlineIso, postedBy,
      status: 'open',
      otp: generatedOTP
    });

    await newQuest.save();
    res.status(201).json(newQuest);
  } catch (error) {
    res.status(500).json({ message: "Error creating quest" });
  }
});

// 3. ACCEPT QUEST ROUTE (Race Condition)
router.put('/:id/accept', async (req: Request, res: Response) => {
  try {
    const { heroUsername } = req.body;

    //Atomic Update
    // We look for the ID *AND* status='open' in one shot.
    const quest = await Quest.findOneAndUpdate(
        { _id: req.params.id, status: 'open' }, 
        { 
            $set: { 
                status: 'active', 
                assignedTo: heroUsername 
            } 
        },
        { new: true } 
    );

    if (!quest) {
        // handles the race condition 
        return res.status(400).json({ message: "Too late! Quest already taken or unavailable." });
    }

    if (quest.postedBy === heroUsername) {
      // Revert if user tried to accept own quest
      quest.status = 'open';
      quest.assignedTo = undefined;
      await quest.save();
      return res.status(403).json({ message: "You cannot accept your own quest!" });
    }

    res.json({ message: "Quest accepted!", quest });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 4. COMPLETE QUEST ROUTE (Atomic Completion)
router.post('/:id/complete', async (req: Request, res: Response) => {
  try {
    const { otp, heroUsername } = req.body;

    // 1. Verify OTP first
    const checkQuest = await Quest.findById(req.params.id);
    if (!checkQuest) return res.status(404).json({ message: "Quest not found" });
    if (checkQuest.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    // 2. ATOMIC COMPLETION
    // Ensure we only complete if it's currently 'active' and assigned to THIS hero
    const quest = await Quest.findOneAndUpdate(
        { 
            _id: req.params.id, 
            status: 'active', 
            assignedTo: heroUsername 
        },
        { $set: { status: 'completed' } },
        { new: true }
    );

    if (!quest) {
        return res.status(400).json({ message: "Cannot complete. Quest not active or you are not the hero." });
    }

    // 3. PAY THE HERO
    const hero = await User.findOne({ username: heroUsername });
    if (hero) {
      hero.balance += quest.reward;
      hero.xp += quest.xp;
      await hero.save();

      await Transaction.create({
        userId: hero.username,
        type: 'credit',
        description: `Reward: ${quest.title}`,
        amount: quest.reward,
        status: 'success'
      });
    }

    res.json({ message: "Quest completed! Funds transferred." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 5. RESIGN QUEST
router.put('/:id/resign', async (req: Request, res: Response) => {
  try {
    const { heroUsername } = req.body;

    const quest = await Quest.findOneAndUpdate(
        { _id: req.params.id, assignedTo: heroUsername, status: 'active' },
        { $set: { status: 'open', assignedTo: null } },
        { new: true }
    );

    if (!quest) return res.status(404).json({ message: "Quest not active or not assigned to you" });

    res.json({ message: "Quest resigned." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 6. CANCEL QUEST
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    // Find and DELETE only if status is OPEN
    const quest = await Quest.findOneAndDelete({ 
        _id: req.params.id, 
        postedBy: username, 
        status: 'open' 
    });

    if (!quest) {
        return res.status(400).json({ message: "Cannot delete. Quest might be active or not found." });
    }

    // REFUND
    const user = await User.findOne({ username });
    if (user) {
      user.balance += quest.reward;
      await user.save();

      await Transaction.create({
        userId: user.username,
        type: 'credit',
        description: `Refund: ${quest.title} (Cancelled)`,
        amount: quest.reward,
        status: 'success'
      });
    }

    res.json({ message: "Quest cancelled & refunded." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 7. RATE HERO
router.post('/:id/rate', async (req: Request, res: Response) => {
  try {
    const { rating } = req.body;
    
    // Ensure we haven't rated yet
    const quest = await Quest.findOneAndUpdate(
        { _id: req.params.id, ratingGiven: { $ne: true } },
        { $set: { ratingGiven: true } },
        { new: true }
    );

    if (!quest || !quest.assignedTo) return res.status(400).json({ message: "Already rated or invalid quest" });

    const hero = await User.findOne({ username: quest.assignedTo });
    if (hero) {
      const totalScore = (hero.rating * hero.ratingCount) + rating;
      hero.ratingCount += 1;
      hero.rating = parseFloat((totalScore / hero.ratingCount).toFixed(1));
      await hero.save();
    }

    res.json({ message: "Rating submitted", newRating: hero?.rating });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 8. SEND MESSAGE
router.post('/:id/messages', async (req: Request, res: Response) => {
  try {
    const { sender, text } = req.body;
    const newMessage = new Message({ questId: req.params.id, sender, text });
    await newMessage.save();
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Error sending message" });
  }
});

// 9. GET MESSAGES
router.get('/:id/messages', async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({ questId: req.params.id }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// 10. PLACE BID
router.post('/:id/bid', async (req: Request, res: Response) => {
  try {
    const { heroUsername, amount } = req.body;

    // Use findOneAndUpdate to push atomically
    const quest = await Quest.findOneAndUpdate(
        { _id: req.params.id, status: 'open', postedBy: { $ne: heroUsername } },
        { 
            $push: { 
                bids: { 
                    heroUsername, 
                    amount, 
                    rating: 5.0,
                    timestamp: new Date() 
                } 
            } 
        },
        { new: true }
    );

    if (!quest) return res.status(400).json({ message: "Bidding failed. Quest closed or you are the owner." });

    res.json({ message: "Bid placed successfully!", quest });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 11. ACCEPT BID
router.put('/:id/accept-bid', async (req: Request, res: Response) => {
  try {
    const { taskMaster, heroUsername, bidAmount } = req.body;
    
    // 1. GET USER
    const user = await User.findOne({ username: taskMaster });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. ATOMIC LOCK: Try to turn the quest 'active' & assign hero.
    const quest = await Quest.findOneAndUpdate(
        { _id: req.params.id, status: 'open', postedBy: taskMaster },
        { 
            $set: { 
                status: 'active', 
                assignedTo: heroUsername,
                bids: [] // Clear bids
            }
        },
        { new: true }
    );

    if (!quest) return res.status(400).json({ message: "Bid acceptance failed. Quest closed or not yours." });

    // 3. MONEY LOGIC
    const originalEscrow = quest.reward; 
    const diff = bidAmount - originalEscrow; // Positive = Pay More, Negative = Refund

    try {
        if (diff > 0) {
            // Case A: Bid is HIGHER than original reward (TaskMaster pays more)
            if (user.balance < diff) {
                throw new Error("Insufficient balance for this bid");
            }
            
            user.balance -= diff;
            await Transaction.create({
                userId: taskMaster, type: 'debit', 
                description: `Escrow Top-up: '${quest.title}'`, 
                amount: diff, status: 'success'
            });

        } else if (diff < 0) {
            // Case B: Bid is LOWER than original reward (TaskMaster gets refund)
            const refundAmount = Math.abs(diff);
            user.balance += refundAmount;
            
            await Transaction.create({
                userId: taskMaster, type: 'credit', 
                description: `Refund: Saved on '${quest.title}' bid`, 
                amount: refundAmount, status: 'success'
            });
        }

        // Save wallet changes
        await user.save();

        // 4. FINALIZE: Update the Quest Reward to the new Bid Amount
        quest.reward = bidAmount;
        await quest.save();

        res.json({ message: "Bid accepted! Hero assigned.", quest });

    } catch (moneyError: any) {
        // --- ROLLBACK MECHANISM ---
        // If money logic fails (e.g. insufficient funds), unlock the quest.
        console.error("Money transaction failed, rolling back quest status...");
        
        await Quest.findByIdAndUpdate(quest._id, { 
            status: 'open', 
            assignedTo: null 
        });

        return res.status(400).json({ message: moneyError.message || "Transaction failed" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
