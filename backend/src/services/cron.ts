import { Quest } from '../models/Quest';
import { User } from '../models/User';

export const checkExpiredQuests = async () => {
  try {
    const now = new Date();
    
    // 1. Find quests that are OPEN or ACTIVE but passed their deadline
    const expiredQuests = await Quest.find({
      status: { $in: ['open', 'active'] },
      deadlineIso: { $lt: now }
    });

    if (expiredQuests.length === 0) return;

    console.log(`Checking Quests... Found ${expiredQuests.length} expired items.`);

    // 2. Process Refunds
    for (const quest of expiredQuests) {
      // Find the Task Master (Poster)
      const user = await User.findOne({ username: quest.postedBy });
      
      if (user) {
        // REFUND THE MONEY
        user.balance += quest.reward;
        await user.save();
        console.log(`💸 Refunded ₹${quest.reward} to ${user.username} for "${quest.title}"`);
      }

      // Mark Quest as EXPIRED so we don't refund it again
      quest.status = 'expired';
      await quest.save();
    }
  } catch (error) {
    console.error("Cron Job Error:", error);
  }
};