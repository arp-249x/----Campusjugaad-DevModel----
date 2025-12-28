import { Quest } from '../models/Quest';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction'; // Import this

export const checkExpiredQuests = async () => {
  try {
    const now = new Date();
    
    const expiredQuests = await Quest.find({
      status: { $in: ['open', 'active'] },
      deadlineIso: { $lt: now }
    });

    if (expiredQuests.length === 0) return;

    for (const quest of expiredQuests) {
      const user = await User.findOne({ username: quest.postedBy });
      
      if (user) {
        // 1. Refund Balance
        user.balance += quest.reward;
        await user.save();

        // 2. CREATE TRANSACTION RECORD (Fixes the issue)
        await Transaction.create({
            userId: user.username,
            type: 'credit',
            description: `Refund: ${quest.title} (Expired)`,
            amount: quest.reward,
            status: 'success'
        });

        console.log(`Refunded ${user.username} for ${quest.title}`);
      }

      quest.status = 'expired';
      await quest.save();
    }
  } catch (error) {
    console.error("Cron Job Error:", error);
  }
};