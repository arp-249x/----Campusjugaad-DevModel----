import { Trophy, Zap, Target, TrendingUp, CircleCheck, Clock } from "lucide-react";

export function DashboardView() {
  const stats = [
    { label: "Total Earnings", value: "₹4,250", icon: TrendingUp, color: "#00F5D4" },
    { label: "Quests Completed", value: "42", icon: CircleCheck, color: "#2D7FF9" },
    { label: "Current Level", value: "15", icon: Trophy, color: "#FFD700" },
    { label: "Total XP", value: "8,450", icon: Zap, color: "#9D4EDD" },
  ];

  const recentQuests = [
    {
      title: "Deliver Lab Coat",
      status: "completed",
      reward: 250,
      xp: 75,
      time: "2 hours ago",
    },
    {
      title: "Print Assignment",
      status: "in-progress",
      reward: 100,
      xp: 30,
      time: "In progress",
    },
    {
      title: "Tutoring Session",
      status: "pending",
      reward: 600,
      xp: 200,
      time: "Tomorrow, 5 PM",
    },
  ];

  const achievements = [
    { title: "Early Bird", description: "Complete 5 quests before 9 AM", unlocked: true },
    { title: "Speed Demon", description: "Complete 10 urgent quests", unlocked: true },
    { title: "Helper Hero", description: "Help 50 students", unlocked: false },
    { title: "Marathon Runner", description: "Complete 100 quests", unlocked: false },
  ];

  return (
    <div className="min-h-screen pt-20 md:pt-28 pb-20 md:pb-16 px-4 md:px-8 bg-[var(--campus-bg)]">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-[var(--campus-text-primary)] mb-2">My Dashboard</h1>
          <p className="text-[var(--campus-text-secondary)]">Track your journey to becoming a Campus Legend</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-[var(--campus-card-bg)] bg-opacity-50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-[var(--campus-border)] hover:border-[var(--campus-border)] transition-all group"
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-2xl md:text-3xl mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-[var(--campus-text-secondary)] text-xs md:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Recent Quests */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--campus-card-bg)] bg-opacity-50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-[var(--campus-border)]">
              <h3 className="text-[var(--campus-text-primary)] mb-4 md:mb-6">Recent Quests</h3>
              <div className="space-y-4">
                {recentQuests.map((quest, index) => (
                  <div
                    key={index}
                    className="bg-[var(--campus-surface)] rounded-xl p-4 border border-[var(--campus-border)] hover:border-[var(--campus-border)] transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-[var(--campus-text-primary)] mb-1">{quest.title}</h4>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-[var(--campus-text-secondary)]" />
                          <span className="text-[var(--campus-text-secondary)]">{quest.time}</span>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs ${
                          quest.status === "completed"
                            ? "bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/30"
                            : quest.status === "in-progress"
                            ? "bg-[#9D4EDD]/10 text-[#9D4EDD] border border-[#9D4EDD]/30"
                            : "bg-[var(--campus-border)] text-[var(--campus-text-secondary)] border border-[var(--campus-border)]"
                        }`}
                      >
                        {quest.status === "completed"
                          ? "Completed"
                          : quest.status === "in-progress"
                          ? "In Progress"
                          : "Pending"}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-3 border-t border-[var(--campus-border)]">
                      <span className="text-[#00F5D4]">₹{quest.reward}</span>
                      <span className="text-[#9D4EDD] text-sm">+{quest.xp} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--campus-card-bg)] bg-opacity-50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-[var(--campus-border)]">
              <h3 className="text-[var(--campus-text-primary)] mb-4 md:mb-6">Achievements</h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`bg-[var(--campus-surface)] rounded-xl p-4 border transition-all ${
                      achievement.unlocked
                        ? "border-[#FFD700]/30"
                        : "border-[var(--campus-border)] opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          achievement.unlocked
                            ? "bg-[#FFD700]/20"
                            : "bg-[var(--campus-border)]"
                        }`}
                      >
                        <Trophy
                          className="w-5 h-5"
                          style={{
                            color: achievement.unlocked ? "#FFD700" : "#666",
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[var(--campus-text-primary)] text-sm mb-1">
                          {achievement.title}
                        </h4>
                        <p className="text-[var(--campus-text-secondary)] text-xs">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 md:mt-8 bg-[var(--campus-card-bg)] bg-opacity-50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-[var(--campus-border)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[var(--campus-text-primary)] mb-1">Level 15 Progress</h3>
              <p className="text-[var(--campus-text-secondary)] text-sm">450 XP to Level 16</p>
            </div>
            <div className="text-[#9D4EDD] text-sm md:text-base">8,450 / 8,900 XP</div>
          </div>
          <div className="relative h-3 bg-[var(--campus-border)] rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#2D7FF9] to-[#9D4EDD] rounded-full transition-all"
              style={{ width: "95%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}