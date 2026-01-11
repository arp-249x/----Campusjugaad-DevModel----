import { Trophy, Crown, Star, TrendingUp, Shield, Zap } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";

interface LeaderboardViewProps {
  currentUser: any;
}

// Mock Data (Real data will be implemented as soon as we have much real users)
const LEADERBOARD_DATA = [
  { id: 1, name: "Arjun K.", xp: 2400, rating: 4.9, quests: 42, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun" },
  { id: 2, name: "Priya S.", xp: 1850, rating: 5.0, quests: 31, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
  { id: 3, name: "Rahul M.", xp: 1200, rating: 4.7, quests: 25, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" },
  { id: 4, name: "Sneha R.", xp: 800, rating: 4.8, quests: 15, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha" },
  { id: 5, name: "Vikram S.", xp: 450, rating: 4.5, quests: 8, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram" },
];

export function LeaderboardView({ currentUser }: LeaderboardViewProps) {
  
  // --- 1. GAMIFICATION ENGINE ---
  const getRankInfo = (xp: number) => {
    if (xp >= 2000) return { title: "Campus Legend", color: "text-yellow-500", icon: Crown, nextLimit: 5000 };
    if (xp >= 1000) return { title: "Quest Master", color: "text-purple-500", icon: Trophy, nextLimit: 2000 };
    if (xp >= 500) return { title: "Rising Star", color: "text-blue-500", icon: Star, nextLimit: 1000 };
    return { title: "Novice Hero", color: "text-slate-400", icon: Shield, nextLimit: 500 };
  };

  const getBadges = (user: any) => {
    const badges = [];
    if (user.rating >= 4.9) badges.push({ icon: Star, color: "text-yellow-500", tooltip: "5-Star Service" });
    if (user.quests >= 30) badges.push({ icon: Zap, color: "text-blue-500", tooltip: "Power User" });
    if (user.xp > 2000) badges.push({ icon: Crown, color: "text-purple-500", tooltip: "Royalty" });
    return badges;
  };

  // Rank Info for Current User
  const myRankInfo = getRankInfo(currentUser?.xp || 0);
  // Calculate Progress Percentage (Max 100%)
  const progressPercent = Math.min(100, ((currentUser?.xp || 0) / myRankInfo.nextLimit) * 100);

  return (
    <div className="min-h-screen pt-24 px-4 pb-24 bg-[var(--campus-bg)]">
      <div className="max-w-3xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Campus <span className="text-[#2D7FF9]">Legends</span></h1>
          <p className="text-[var(--campus-text-secondary)]">Compete, earn XP, and become a legend.</p>
        </div>

        {/* --- 2. YOUR STATS CARD --- */}
        <div className="bg-gradient-to-r from-[#2D7FF9]/10 to-[#9D4EDD]/10 border border-[#2D7FF9]/30 rounded-2xl p-6 mb-8 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <myRankInfo.icon className="w-32 h-32" />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6 relative z-10">
                <Avatar className="w-20 h-20 border-4 border-[#2D7FF9] shadow-md">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username}`} />
                    <AvatarFallback>{currentUser?.name?.[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[var(--campus-text-primary)]">{currentUser?.name}</h2>
                    <div className={`flex items-center gap-2 font-bold text-lg mt-1 ${myRankInfo.color}`}>
                        <myRankInfo.icon className="w-5 h-5 fill-current" />
                        {myRankInfo.title}
                    </div>
                </div>

                <div className="text-left md:text-right">
                    <p className="text-3xl font-black text-[var(--campus-text-primary)]">{currentUser?.xp || 0} <span className="text-sm font-normal text-[var(--campus-text-secondary)]">XP</span></p>
                    <p className="text-sm text-[var(--campus-text-secondary)]">Total Earned</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 relative z-10">
                <div className="flex justify-between text-xs font-medium text-[var(--campus-text-secondary)]">
                    <span>Progress to next rank</span>
                    <span>{myRankInfo.nextLimit - (currentUser?.xp || 0)} XP needed</span>
                </div>
                <Progress value={progressPercent} className="h-3 bg-[var(--campus-border)]" />
            </div>
        </div>

        {/* --- 3. LEADERBOARD LIST --- */}
        <div className="bg-[var(--campus-card-bg)] border border-[var(--campus-border)] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[var(--campus-border)] bg-[var(--campus-surface)]/50 backdrop-blur-sm">
                <h3 className="font-bold flex items-center gap-2 text-[var(--campus-text-primary)]">
                    <TrendingUp className="w-5 h-5 text-green-500" /> Top Heroes this Week
                </h3>
            </div>
            
            <div className="divide-y divide-[var(--campus-border)]">
                {LEADERBOARD_DATA.map((user, index) => {
                    const rank = getRankInfo(user.xp);
                    const badges = getBadges(user);
                    const isTopThree = index < 3;

                    return (
                        <div key={user.id} className="p-4 flex items-center gap-4 hover:bg-[var(--campus-surface)] transition-colors group">
                            {/* Rank Number */}
                            <div className={`w-8 text-center font-bold text-lg ${
                                index === 0 ? "text-yellow-500 drop-shadow-sm" : 
                                index === 1 ? "text-slate-400" : 
                                index === 2 ? "text-orange-500" : "text-[var(--campus-text-secondary)]"
                            }`}>
                                #{index + 1}
                            </div>

                            <Avatar className={`border-2 ${isTopThree ? 'border-transparent ring-2 ring-offset-2 ring-offset-[var(--campus-bg)]' : 'border-transparent'} ${
                                index === 0 ? 'ring-yellow-500' : index === 1 ? 'ring-slate-400' : index === 2 ? 'ring-orange-500' : ''
                            }`}>
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-[var(--campus-text-primary)] truncate">{user.name}</span>
                                    {/* Badges Row */}
                                    <div className="flex gap-1">
                                        {badges.map((b, i) => (
                                            <div key={i} title={b.tooltip}>
                                                <b.icon className={`w-4 h-4 ${b.color}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-xs text-[var(--campus-text-secondary)] flex items-center gap-1 mt-0.5">
                                    {rank.title} • {user.quests} Quests
                                </div>
                            </div>

                            <div className="text-right whitespace-nowrap">
                                <div className="font-bold text-[var(--campus-text-primary)]">{user.xp} XP</div>
                                <div className="text-xs flex items-center justify-end gap-1 text-yellow-500 font-medium">
                                    <Star className="w-3 h-3 fill-current" /> {user.rating}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
}
