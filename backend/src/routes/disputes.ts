import express, { Request, Response } from 'express';
import { Quest } from '../models/Quest';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';

const router = express.Router();

// 1. RAISE A DISPUTE
router.post('/:id/raise', async (req: Request, res: Response) => {
  try {
    const { username, reason } = req.body;
    
    // 1. Get current status BEFORE updating
    const questToCheck = await Quest.findById(req.params.id);
    if (!questToCheck) return res.status(404).json({ message: "Quest not found" });

    // Lock the quest
    const quest = await Quest.findOneAndUpdate(
      { _id: req.params.id, status: { $in: ['active', 'completed'] } }, 
      { 
        $set: { 
          status: 'disputed',
          dispute: {
            raisedBy: username,
            reason: reason,
            status: 'pending',
            createdAt: new Date(),
            previousStatus: questToCheck.status // Save status to handle refunds correctly
          }
        } 
      },
      { new: true }
    );

    if (!quest) return res.status(400).json({ message: "Cannot dispute this quest." });

    res.json({ message: "Dispute raised.", quest });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 2. GET ALL DISPUTES
router.get('/', async (req: Request, res: Response) => {
  try {
    const disputes = await Quest.find({ status: 'disputed' }).sort({ 'dispute.createdAt': -1 });
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching disputes" });
  }
});

// 3. RESOLVE DISPUTE
router.post('/:id/resolve', async (req: Request, res: Response) => {
  try {
    const { resolution, adminUsername } = req.body; 
    
    const quest = await Quest.findById(req.params.id);
    if (!quest || quest.status !== 'disputed') {
      return res.status(400).json({ message: "Quest not found or not disputed" });
    }

    const poster = await User.findOne({ username: quest.postedBy });
    const hero = await User.findOne({ username: quest.assignedTo });

    if (!poster || !hero) return res.status(404).json({ message: "Users not found" });

    const wasAlreadyPaid = quest.dispute?.previousStatus === 'completed';

    // --- RESOLUTION LOGIC ---

    if (resolution === 'refund_poster') {
      // CASE A: Refund Task Master
      if (wasAlreadyPaid) {
          if (hero.balance < quest.reward) {
              // Note: In production, handle negative balance logic here
          }
          hero.balance -= quest.reward;
          hero.xp -= quest.xp; 
          await hero.save();
          await Transaction.create({ userId: hero.username, type: 'debit', amount: quest.reward, description: `Dispute Clawback: ${quest.title}`, status: 'success' });
      }

      poster.balance += quest.reward;
      await poster.save();
      await Transaction.create({ userId: poster.username, type: 'credit', amount: quest.reward, description: `Dispute Refund: ${quest.title}`, status: 'success' });
      
      quest.status = 'resolved';
      quest.dispute!.adminComment = "Resolved: Refunded to Task Master";

    } else if (resolution === 'pay_hero') {
      // CASE B: Pay Hero
      if (!wasAlreadyPaid) {
          hero.balance += quest.reward;
          hero.xp += quest.xp;
          await hero.save();
          await Transaction.create({ userId: hero.username, type: 'credit', amount: quest.reward, description: `Dispute Settlement: ${quest.title}`, status: 'success' });
      }

      // 👇 THE FIX: Mark as 'resolved' (Green), NOT 'completed' (Blue)
      quest.status = 'resolved'; 
      quest.dispute!.adminComment = "Resolved: Funds released to Hero";

    } else if (resolution === 'split') {
      // CASE C: 50/50 Split
      const splitAmount = Math.floor(quest.reward / 2);

      if (wasAlreadyPaid) {
          hero.balance -= splitAmount;
          await hero.save();
          await Transaction.create({ userId: hero.username, type: 'debit', amount: splitAmount, description: `Dispute Split (Return): ${quest.title}`, status: 'success' });

          poster.balance += splitAmount;
          await poster.save();
          await Transaction.create({ userId: poster.username, type: 'credit', amount: splitAmount, description: `Dispute Split (Refund): ${quest.title}`, status: 'success' });
      } else {
          poster.balance += splitAmount;
          hero.balance += splitAmount;
          await poster.save();
          await hero.save();
          await Transaction.create({ userId: poster.username, type: 'credit', amount: splitAmount, description: `Dispute Split`, status: 'success' });
          await Transaction.create({ userId: hero.username, type: 'credit', amount: splitAmount, description: `Dispute Split`, status: 'success' });
      }

      quest.status = 'resolved';
      quest.dispute!.adminComment = "Resolved: 50/50 Split";
    }

    quest.dispute!.status = 'resolved';
    await quest.save();

    res.json({ message: "Dispute resolved successfully!", quest });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;