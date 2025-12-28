import { Trophy, Medal, Crown, TrendingUp, User } from "lucide-react";

interface LeaderboardViewProps {
  currentUser?: any;
}

export function LeaderboardView({ currentUser }: LeaderboardViewProps) {
  // REDUCED XP SCALES for better demo scaling
  const baseUsers = [
    { name: "Rahul Sharma", xp: 350, role: "Campus Legend", avatar: "RS" },
    { name: "Priya Patel", xp: 280, role: "Task Master", avatar: "PP" },
    { name: "Amit Kumar", xp: 210, role: "Rising Star", avatar: "AK" },
    { name: "Sneha Gupta", xp: 150, role: "Hustler", avatar: "SG" },
    { name: "Vikram Singh", xp: 90, role: "Rookie", avatar: "VS" },
  ];

  // Merge current user into list
  let allUsers = [...baseUsers];
  
  if (currentUser) {
      const existingIndex = allUsers.findIndex(u => u.name === currentUser.name);
      if (existingIndex !== -1) {
          allUsers[existingIndex].xp = currentUser.xp; 
      } else {
          allUsers.push({
              name: currentUser.name,
              xp: currentUser.xp || 0,
              role: "You",
              avatar: currentUser.name.substring(0,2).toUpperCase()
          });
      }
  }

  // Sort by XP
  allUsers.sort((a, b) => b.xp - a.xp);

  // Find current user rank
  const userRank = allUsers.findIndex(u => u.name === currentUser?.name) + 1;

  return (
    <div className="min-h-screen pt-20 px-4 pb-20 bg-[var(--campus-bg)]">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
            Hall of Fame
          </h1>
          <p className="text-[var(--campus-text-secondary)]">Top hustlers of the semester</p>
        </div>

        {/* Your Rank Card */}
        <div className="bg-gradient-to-r from-[#2D7FF9]/20 to-[#9D4EDD]/20 border border-[#2D7FF9]/50 rounded-2xl p-6 mb-8 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D7FF9]/20 blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-4 z-10">
             <div className="h-16 w-16 rounded-full border-4 border-[#2D7FF9] flex items-center justify-center bg-[var(--campus-bg)] shadow-lg shadow-[#2D7FF9]/20">
                <span className="text-xl font-bold text-[#2D7FF9]">#{userRank}</span>
             </div>
             <div>
                <h2 className="text-xl font-bold text-[var(--campus-text-primary)]">{currentUser?.name}</h2>
                <p className="text-[#2D7FF9] text-sm font-medium">{currentUser?.xp || 0} XP</p>
             </div>
          </div>
          
          <div className="text-right z-10">
             <p className="text-[var(--campus-text-secondary)] text-sm mb-1">Weekly Growth</p>
             <div className="flex items-center gap-1 text-green-400 justify-end">
                <TrendingUp className="w-4 h-4" />
                <span className="font-bold">+12%</span>
             </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {allUsers.slice(0, 10).map((user, index) => (
            <div 
              key={index}
              className={`flex items-center p-4 rounded-xl border transition-all hover:scale-[1.01] ${
                user.name === currentUser?.name 
                  ? "bg-[#2D7FF9]/10 border-[#2D7FF9] shadow-lg shadow-[#2D7FF9]/10" 
                  : "bg-[var(--campus-card-bg)] border-[var(--campus-border)]"
              }`}
            >
              <div className="w-8 font-bold text-[var(--campus-text-secondary)]">
                 {index + 1}
              </div>
              
              <div className="flex-1 flex items-center gap-4">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? "bg-yellow-500 shadow-yellow-500/50" :
                    index === 1 ? "bg-gray-400 shadow-gray-400/50" :
                    index === 2 ? "bg-orange-600 shadow-orange-600/50" :
                    "bg-[var(--campus-surface)] text-[var(--campus-text-secondary)]"
                 }`}>
                    {index === 0 ? <Crown className="w-5 h-5" /> : user.avatar}
                 </div>
                 <div>
                    <h3 className="font-bold text-[var(--campus-text-primary)]">
                       {user.name} 
                       {user.name === currentUser?.name && <span className="ml-2 text-xs bg-[#2D7FF9] text-white px-2 py-0.5 rounded-full">YOU</span>}
                    </h3>
                    <p className="text-xs text-[var(--campus-text-secondary)]">{user.role}</p>
                 </div>
              </div>

              <div className="font-mono font-bold text-[#00F5D4]">
                 {user.xp} XP
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}