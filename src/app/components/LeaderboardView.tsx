import { Crown, Medal, TrendingUp, Zap } from "lucide-react";

export function LeaderboardView() {
  const topPlayers = [
    {
      rank: 1,
      name: "Arjun Kumar",
      avatar: "AK",
      level: 28,
      xp: 15420,
      quests: 156,
      earnings: 18500,
      hostel: "Hostel A",
      badge: "Legend",
    },
    {
      rank: 2,
      name: "Priya Sharma",
      avatar: "PS",
      level: 26,
      xp: 14200,
      quests: 142,
      earnings: 16800,
      hostel: "Hostel B",
      badge: "Master",
    },
    {
      rank: 3,
      name: "Rahul Verma",
      avatar: "RV",
      level: 24,
      xp: 13100,
      quests: 128,
      earnings: 15200,
      hostel: "Hostel C",
      badge: "Expert",
    },
    {
      rank: 4,
      name: "Sneha Patel",
      avatar: "SP",
      level: 22,
      xp: 11800,
      quests: 115,
      earnings: 13600,
      hostel: "Hostel A",
      badge: "Pro",
    },
    {
      rank: 5,
      name: "Vikram Singh",
      avatar: "VS",
      level: 20,
      xp: 10500,
      quests: 98,
      earnings: 11400,
      hostel: "Hostel D",
      badge: "Pro",
    },
    {
      rank: 6,
      name: "Ananya Das",
      avatar: "AD",
      level: 19,
      xp: 9800,
      quests: 89,
      earnings: 10200,
      hostel: "Hostel B",
      badge: "Advanced",
    },
    {
      rank: 7,
      name: "Rohan Joshi",
      avatar: "RJ",
      level: 18,
      xp: 9100,
      quests: 82,
      earnings: 9500,
      hostel: "Hostel C",
      badge: "Advanced",
    },
    {
      rank: 8,
      name: "Rishav (You)",
      avatar: "R",
      level: 15,
      xp: 8450,
      quests: 42,
      earnings: 4250,
      hostel: "Hostel A",
      badge: "Intermediate",
      isCurrentUser: true,
    },
  ];

  const hostelStandings = [
    { name: "Hostel A", points: 45230, members: 234 },
    { name: "Hostel B", points: 42100, members: 198 },
    { name: "Hostel C", points: 38900, members: 221 },
    { name: "Hostel D", points: 35600, members: 187 },
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#FFD700";
    if (rank === 2) return "#C0C0C0";
    if (rank === 3) return "#CD7F32";
    return "#9D4EDD";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6" style={{ color: "#FFD700" }} fill="#FFD700" />;
    if (rank === 2) return <Medal className="w-6 h-6" style={{ color: "#C0C0C0" }} />;
    if (rank === 3) return <Medal className="w-6 h-6" style={{ color: "#CD7F32" }} />;
    return null;
  };

  return (
    <div className="min-h-screen pt-20 md:pt-28 pb-20 md:pb-16 px-4 md:px-8 bg-[var(--campus-bg)]">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="mb-4">
            <span className="bg-gradient-to-r from-[#FFD700] via-[#2D7FF9] to-[#9D4EDD] bg-clip-text text-transparent">
              Campus Leaderboard
            </span>
          </h1>
          <p className="text-[var(--campus-text-secondary)] text-lg md:text-xl">
            See who's dominating the campus game!
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--campus-card-bg)] bg-opacity-50 backdrop-blur-xl rounded-2xl border border-[var(--campus-border)] overflow-hidden">
              {/* Top 3 Podium */}
              <div className="bg-gradient-to-b from-[var(--campus-border)] to-transparent p-6 md:p-8 border-b border-[var(--campus-border)]">
                <div className="flex items-end justify-center gap-4 md:gap-6">
                  {/* 2nd Place */}
                  <div className="text-center flex-1 max-w-[140px] md:max-w-[180px]">
                    <div className="relative inline-block mb-3">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#C0C0C0] to-[#999999] flex items-center justify-center text-white border-4 border-[#C0C0C0]/30 text-sm md:text-base">
                        {topPlayers[1].avatar}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#C0C0C0] text-black px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs">
                        #2
                      </div>
                    </div>
                    <h4 className="text-[var(--campus-text-primary)] mb-1 text-sm md:text-base">{topPlayers[1].name}</h4>
                    <div className="text-[#C0C0C0] text-xs md:text-sm">{topPlayers[1].xp.toLocaleString()} XP</div>
                  </div>

                  {/* 1st Place */}
                  <div className="text-center flex-1 max-w-[160px] md:max-w-[200px] -translate-y-2 md:-translate-y-4">
                    <Crown className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-[#FFD700]" fill="#FFD700" />
                    <div className="relative inline-block mb-3">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center text-black border-4 border-[#FFD700]/30 shadow-lg shadow-[#FFD700]/50 text-base md:text-lg">
                        {topPlayers[0].avatar}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FFD700] text-black px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs">
                        #1
                      </div>
                    </div>
                    <h4 className="text-[var(--campus-text-primary)] mb-1 text-sm md:text-base">{topPlayers[0].name}</h4>
                    <div className="text-[#FFD700] text-xs md:text-sm">{topPlayers[0].xp.toLocaleString()} XP</div>
                  </div>

                  {/* 3rd Place */}
                  <div className="text-center flex-1 max-w-[140px] md:max-w-[180px]">
                    <div className="relative inline-block mb-3">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#CD7F32] to-[#A0522D] flex items-center justify-center text-white border-4 border-[#CD7F32]/30 text-sm md:text-base">
                        {topPlayers[2].avatar}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#CD7F32] text-white px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs">
                        #3
                      </div>
                    </div>
                    <h4 className="text-[var(--campus-text-primary)] mb-1 text-sm md:text-base">{topPlayers[2].name}</h4>
                    <div className="text-[#CD7F32] text-xs md:text-sm">{topPlayers[2].xp.toLocaleString()} XP</div>
                  </div>
                </div>
              </div>

              {/* Full Rankings List */}
              <div className="p-4 md:p-6">
                <div className="space-y-3">
                  {topPlayers.map((player) => (
                    <div
                      key={player.rank}
                      className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border transition-all ${
                        player.isCurrentUser
                          ? "bg-[#2D7FF9]/10 border-[#2D7FF9]/30 shadow-lg shadow-[#2D7FF9]/10"
                          : "bg-[var(--campus-surface)] border-[var(--campus-border)] hover:border-[var(--campus-border)]"
                      }`}
                    >
                      {/* Rank */}
                      <div className="w-8 md:w-12 flex items-center justify-center">
                        {player.rank <= 3 ? (
                          <div className="scale-75 md:scale-100">{getRankIcon(player.rank)}</div>
                        ) : (
                          <span className="text-[var(--campus-text-secondary)] text-sm md:text-base">#{player.rank}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white text-sm md:text-base"
                        style={{
                          background: `linear-gradient(135deg, ${getRankColor(player.rank)}, ${getRankColor(player.rank)}99)`,
                        }}
                      >
                        {player.avatar}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[var(--campus-text-primary)] text-sm md:text-base truncate">{player.name}</h4>
                          <span
                            className="px-2 py-0.5 rounded text-xs shrink-0"
                            style={{
                              backgroundColor: `${getRankColor(player.rank)}20`,
                              color: getRankColor(player.rank),
                              border: `1px solid ${getRankColor(player.rank)}40`,
                            }}
                          >
                            {player.badge}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-[var(--campus-text-secondary)]">
                          <span className="hidden sm:inline">{player.hostel}</span>
                          <span>Level {player.level}</span>
                        </div>
                      </div>

                      {/* Stats - Hide some on mobile */}
                      <div className="flex items-center gap-3 md:gap-6 text-xs md:text-sm">
                        <div className="text-center">
                          <div className="text-[#9D4EDD] mb-1">{player.xp.toLocaleString()}</div>
                          <div className="text-[var(--campus-text-secondary)] text-xs hidden md:block">XP</div>
                        </div>
                        <div className="text-center hidden sm:block">
                          <div className="text-[#00F5D4] mb-1">₹{player.earnings.toLocaleString()}</div>
                          <div className="text-[var(--campus-text-secondary)] text-xs hidden md:block">Earned</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Guild Wars */}
            <div className="bg-[var(--campus-card-bg)] bg-opacity-50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-[var(--campus-border)]">
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <TrendingUp className="w-5 h-5 text-[#9D4EDD]" />
                <h3 className="text-[var(--campus-text-primary)]">Guild Wars</h3>
              </div>
              <div className="space-y-3">
                {hostelStandings.map((hostel, index) => (
                  <div
                    key={index}
                    className="bg-[var(--campus-surface)] rounded-xl p-4 border border-[var(--campus-border)]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--campus-text-secondary)]">#{index + 1}</span>
                        <h4 className="text-[var(--campus-text-primary)]">{hostel.name}</h4>
                      </div>
                      <Zap className="w-4 h-4 text-[#9D4EDD]" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#9D4EDD]">{hostel.points.toLocaleString()} pts</span>
                      <span className="text-[var(--campus-text-secondary)]">{hostel.members} members</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Stats */}
            <div className="bg-gradient-to-br from-[#2D7FF9]/20 to-[#9D4EDD]/20 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20">
              <h3 className="text-[var(--campus-text-primary)] mb-4">Your Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[var(--campus-text-secondary)]">Current Rank</span>
                  <span className="text-[var(--campus-text-primary)]">#8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--campus-text-secondary)]">Next Rank</span>
                  <span className="text-[#9D4EDD]">650 XP away</span>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-xl md:text-2xl text-[#00F5D4] mb-1">₹4,250</div>
                    <div className="text-[var(--campus-text-secondary)] text-sm">Total Earnings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}