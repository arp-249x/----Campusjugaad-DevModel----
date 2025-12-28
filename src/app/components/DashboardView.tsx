import { Clock, CheckCircle2, AlertCircle, Package } from "lucide-react";

interface DashboardViewProps {
  currentUser: any;
  activeQuest: any;
  activityLog: any[];
  postedQuests: any[];
}

export function DashboardView({ currentUser, activeQuest, activityLog, postedQuests }: DashboardViewProps) {
  return (
    <div className="min-h-screen pt-24 px-4 pb-20 bg-[var(--campus-bg)]">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Welcome Header */}
        <div className="mb-8">
           <h1 className="text-3xl font-bold text-[var(--campus-text-primary)]">
             Dashboard
           </h1>
           <p className="text-[var(--campus-text-secondary)]">
             Welcome back, {currentUser?.name}. Here's what's happening.
           </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <StatCard label="Total XP" value={currentUser?.xp || 0} icon="⚡" color="bg-yellow-500/20 text-yellow-500" />
           <StatCard label="Tasks Done" value={activityLog.length} icon="✅" color="bg-green-500/20 text-green-500" />
           <StatCard label="Posted" value={postedQuests.length} icon="📢" color="bg-blue-500/20 text-blue-500" />
           <StatCard label="Rating" value="5.0" icon="⭐" color="bg-orange-500/20 text-orange-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Left Column: Active & Posted */}
           <div className="space-y-6">
              <h2 className="text-xl font-bold text-[var(--campus-text-primary)]">Current Status</h2>
              
              {/* Active Quest Card */}
              {activeQuest ? (
                 <div className="bg-gradient-to-r from-[#2D7FF9]/20 to-[#9D4EDD]/20 border border-[#2D7FF9]/40 p-5 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-xs font-bold bg-[#2D7FF9] text-white px-2 py-1 rounded">ACTIVE</div>
                    <h3 className="font-bold text-lg text-[var(--campus-text-primary)] mb-1">{activeQuest.title}</h3>
                    <p className="text-sm text-[var(--campus-text-secondary)] mb-3">{activeQuest.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                       <span className="flex items-center gap-1 text-green-400"><Clock className="w-4 h-4"/> In Progress</span>
                       <span className="font-mono text-[var(--campus-text-primary)]">Reward: ₹{activeQuest.reward}</span>
                    </div>
                 </div>
              ) : (
                 <div className="border border-dashed border-[var(--campus-border)] rounded-2xl p-6 text-center text-[var(--campus-text-secondary)]">
                    No active quest right now. Go find one!
                 </div>
              )}

              {/* Posted Quests List */}
              <div>
                 <h3 className="text-sm font-bold text-[var(--campus-text-secondary)] uppercase tracking-wider mb-3">Posted by You</h3>
                 {postedQuests.length > 0 ? (
                    <div className="space-y-3">
                       {postedQuests.map((q, i) => (
                          <div key={i} className="bg-[var(--campus-card-bg)] border border-[var(--campus-border)] p-4 rounded-xl flex justify-between items-center">
                             <div>
                                <p className="font-medium text-[var(--campus-text-primary)]">{q.title}</p>
                                <p className="text-xs text-[var(--campus-text-secondary)]">{q.deadline}</p>
                             </div>
                             <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">PENDING</span>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <p className="text-sm text-[var(--campus-text-secondary)] italic">You haven't asked for help yet.</p>
                 )}
              </div>
           </div>

           {/* Right Column: History */}
           <div>
              <h2 className="text-xl font-bold text-[var(--campus-text-primary)] mb-4">Recent Activity</h2>
              <div className="bg-[var(--campus-card-bg)] border border-[var(--campus-border)] rounded-2xl overflow-hidden">
                 {activityLog.length > 0 ? (
                    <div className="divide-y divide-[var(--campus-border)]">
                       {activityLog.map((quest, i) => (
                          <div key={i} className="p-4 flex items-center justify-between hover:bg-[var(--campus-surface)] transition-colors">
                             <div className="flex items-center gap-3">
                                <div className="bg-green-500/10 p-2 rounded-full text-green-500">
                                   <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                   <p className="font-medium text-[var(--campus-text-primary)]">{quest.title}</p>
                                   <p className="text-xs text-[var(--campus-text-secondary)]">Completed</p>
                                </div>
                             </div>
                             <span className="font-bold text-[#00F5D4]">+₹{quest.reward}</span>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <div className="p-8 text-center">
                       <Package className="w-12 h-12 text-[var(--campus-border)] mx-auto mb-2" />
                       <p className="text-[var(--campus-text-secondary)]">No completed tasks yet.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: any) {
    return (
        <div className="bg-[var(--campus-card-bg)] border border-[var(--campus-border)] p-4 rounded-xl flex flex-col items-center justify-center text-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mb-2 ${color}`}>
                {icon}
            </div>
            <div className="text-2xl font-bold text-[var(--campus-text-primary)]">{value}</div>
            <div className="text-xs text-[var(--campus-text-secondary)] uppercase">{label}</div>
        </div>
    )
}