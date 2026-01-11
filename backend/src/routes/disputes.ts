import express, { Request, Response } from 'express';
import { Quest } from '../models/Quest';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS
  }
});

const roundToTwo = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

// 1. RAISE A DISPUTE
router.post('/:id/raise', async (req: Request, res: Response) => {
  try {
    const { username, reason } = req.body;
    
    // 1. Get current status
    const questToCheck = await Quest.findById(req.params.id);
    if (!questToCheck) return res.status(404).json({ message: "Quest not found" });

    // 2. Lock the quest
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
            previousStatus: questToCheck.status
          }
        } 
      },
      { new: true }
    );

    if (!quest) return res.status(400).json({ message: "Cannot dispute this quest." });

    const taskMaster = await User.findOne({ username: quest.postedBy });
    const hero = await User.findOne({ username: quest.assignedTo });

    if (taskMaster && hero && process.env.EMAIL_USER) {
        const adminEmail = process.env.EMAIL_USER;
        const disputeId = quest._id.toString();
        const subjectLine = `[DISPUTE: ${disputeId}] Action Required: ${quest.title}`;
        
        //forces email clients to group messages
        const threadId = `<dispute-${disputeId}@campusjugaad.com>`;

        const commonBody = `
Dear User,

A dispute has been raised regarding the quest: "${quest.title}".

Status: 🔴 DISPUTED
Reported By: @${username}
Reason: "${reason}"

--- ACTION REQUIRED ---
Please REPLY directly to this email with your side of the story.
- Attach screenshots/proofs if available.
- Be concise and honest.

Our Admin team will review the evidence and issue a resolution.

- Campus Jugaad Support
        `;

        // Email to Task Master (Hero is HIDDEN)
        await transporter.sendMail({
            from: 'Campus Jugaad Support <noreply@campusjugaad.com>',
            to: taskMaster.email,
            bcc: adminEmail, // Admin gets a copy
            replyTo: adminEmail, // Replies go to Admin
            subject: subjectLine,
            text: commonBody,
            headers: {
                'Message-ID': `<tm-${disputeId}@campusjugaad.com>`,
                'References': threadId,
                'In-Reply-To': threadId
            }
        });

        // Email to Hero (Task Master is HIDDEN)
        await transporter.sendMail({
            from: 'Campus Jugaad Support <noreply@campusjugaad.com>',
            to: hero.email,
            bcc: adminEmail, // Admin gets a copy
            replyTo: adminEmail, // Replies go to Admin
            subject: subjectLine,
            text: commonBody,
            headers: {
                'Message-ID': `<hero-${disputeId}@campusjugaad.com>`,
                'References': threadId,
                'In-Reply-To': threadId
            }
        });
    }

    res.json({ message: "Dispute raised. Check your email for instructions.", quest });
  } catch (error) {
    console.error(error);
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
      if (wasAlreadyPaid) {
          hero.balance = roundToTwo(hero.balance - quest.reward);
          hero.xp -= quest.xp; 
          await hero.save();
          await Transaction.create({ userId: hero.username, type: 'debit', amount: quest.reward, description: `Dispute Clawback: ${quest.title}`, status: 'success' });
      }

      poster.balance = roundToTwo(poster.balance + quest.reward);
      await poster.save();
      await Transaction.create({ userId: poster.username, type: 'credit', amount: quest.reward, description: `Dispute Refund: ${quest.title}`, status: 'success' });
      
      quest.status = 'resolved';
      quest.dispute!.adminComment = "Resolved: Refunded to Task Master";

    } else if (resolution === 'pay_hero') {
      if (!wasAlreadyPaid) {
          hero.balance = roundToTwo(hero.balance + quest.reward);
          hero.xp += quest.xp;
          await hero.save();
          await Transaction.create({ userId: hero.username, type: 'credit', amount: quest.reward, description: `Dispute Settlement: ${quest.title}`, status: 'success' });
      }

      quest.status = 'resolved'; 
      quest.dispute!.adminComment = "Resolved: Funds released to Hero";

    } else if (resolution === 'split') {
      const splitAmount = roundToTwo(quest.reward / 2);

      if (wasAlreadyPaid) {
          hero.balance = roundToTwo(hero.balance - splitAmount);
          await hero.save();
          await Transaction.create({ userId: hero.username, type: 'debit', amount: splitAmount, description: `Dispute Split (Return): ${quest.title}`, status: 'success' });

          poster.balance = roundToTwo(poster.balance + splitAmount);
          await poster.save();
          await Transaction.create({ userId: poster.username, type: 'credit', amount: splitAmount, description: `Dispute Split (Refund): ${quest.title}`, status: 'success' });
      } else {
          poster.balance = roundToTwo(poster.balance + splitAmount);
          hero.balance = roundToTwo(hero.balance + splitAmount);
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

