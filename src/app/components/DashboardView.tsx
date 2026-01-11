import { Clock, CheckCircle2, Package, Trash2, Star, MessageSquare, ArrowUpDown, AlertTriangle, Calendar } from "lucide-react"; // Added Calendar
import { useState, useMemo } from "react";
import { Button } from "./ui/button";

interface DashboardViewProps {
  currentUser: any;
  activeQuest: any;
  activityLog: any[];
  postedQuests: any[];
  onCancelQuest: (id: string) => void;
  onRateHero: (questId: string, rating: number) => void;
  onOpenChat: (quest: any) => void; 
  onDispute: (quest: any) => void; 
  hasUnread?: boolean;
}

export function DashboardView({ 
  currentUser, 
  activeQuest, 
  activityLog, 
  postedQuests,
  onCancelQuest,
  onRateHero,
  onOpenChat,
  onDispute, 
  hasUnread
}: DashboardViewProps) {
  
  const [focusedQuestId, setFocusedQuestId] = useState<string | null>(null);

  const handleAcceptBid = async (questId: string, heroUsername: string, bidAmount: number) => {
    try {
        const res = await fetch(`/api/quests/${questId}/accept-bid`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                taskMaster: currentUser.username,
                heroUsername, 
                bidAmount 
            })
        });
        if (res.ok) {
            alert("Bid Accepted! Hero assigned."); 
            window.location.reload(); 
        } else {
            const err = await res.json();
            alert(err.message || "Failed to accept bid");
        }
    } catch (e) { console.error(e); }
  };

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
           <StatCard label="Rating" value={currentUser?.rating || "5.0"} icon="⭐" color="bg-orange-500/20 text-orange-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           <div className="space-y-6">
              <h2 className="text-xl font-bold text-[var(--campus-text-primary)]">Current Status</h2>
              
              {activeQuest ? (
                 activeQuest.status === 'disputed' ? (
                    <div className="bg-red-500/10 border border-red-500 p-5 rounded-2xl relative animate-in fade-in">
                        <div className="absolute top-2 right-2 text-xs font-bold bg-red-500 text-white px-2 py-1 rounded">DISPUTED</div>
                        <h3 className="font-bold text-lg text-red-500 mb-1">{activeQuest.title}</h3>
                        <p className="text-sm text-[var(--campus-text-secondary)] mb-3">
                            This quest has been reported. Funds are locked until an admin resolves the issue.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-red-400">
                             <AlertTriangle className="w-4 h-4"/> Under Review
                        </div>
                    </div>
                 ) : (
                    <div className="bg-gradient-to-r from-[#2D7FF9]/20 to-[#9D4EDD]/20 border border-[#2D7FF9]/40 p-5 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-2 right-2 text-xs font-bold bg-[#2D7FF9] text-white px-2 py-1 rounded">ACTIVE</div>
                        <h3 className="font-bold text-lg text-[var(--campus-text-primary)] mb-1">{activeQuest.title}</h3>
                        <p className="text-sm text-[var(--campus-text-secondary)] mb-1">{activeQuest.description}</p>
                        
                        {/* 👇 UPDATED: Added Deadline */}
                        <div className="flex items-center gap-2 mb-4 text-xs text-[var(--campus-text-secondary)]">
                            <Calendar className="w-3 h-3 text-[#2D7FF9]" />
                            <span>Deadline: <span className="text-[var(--campus-text-primary)]">{activeQuest.deadline}</span></span>
                        </div>
                        
                        {currentUser.username === activeQuest.postedBy ? (
                            <div className="bg-black/20 p-3 rounded-lg flex items-center justify-between mb-3">
                                <span className="text-sm text-[var(--campus-text-secondary)]">Share OTP with Hero:</span>
                                <span className="font-mono text-xl font-bold text-[#00F5D4] tracking-widest">
                                    {activeQuest.otp || "******"} 
                                </span>
                            </div>
                        ) : (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg mb-3">
                                <p className="text-sm text-yellow-500 text-center">
                                    Ask the <strong>Task Master</strong> for the OTP to complete this quest.
                                </p>
                            </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-green-400">
                                <Clock className="w-4 h-4"/> In Progress
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:bg-red-500/10"
                                    onClick={() => onDispute(activeQuest)}
                                >
                                    <AlertTriangle className="w-4 h-4 mr-1" /> Report
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-[var(--campus-text-primary)] hover:bg-white/10 relative"
                                    onClick={() => onOpenChat(activeQuest)}
                                >
                                    <MessageSquare className="w-4 h-4 mr-2" /> 
                                    Chat
                                    {hasUnread && (
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border border-[var(--campus-card-bg)] rounded-full animate-bounce"></span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                 )
              ) : (
                 <div className="border border-dashed border-[var(--campus-border)] rounded-2xl p-6 text-center text-[var(--campus-text-secondary)]">
                    No active quest right now. Go find one!
                 </div>
              )}

              {/* ... Rest of the file (Posted by You, etc.) remains unchanged ... */}
              <div>
                 <h3 className="text-sm font-bold text-[var(--campus-text-secondary)] uppercase tracking-wider mb-3">Posted by You</h3>
                 {postedQuests.length > 0 ? (
                    <div className="space-y-3">
                       {postedQuests.map((q: any, i: number) => (
                          <div key={i} className="bg-[var(--campus-card-bg)] border border-[var(--campus-border)] p-4 rounded-xl">
                             <div className="flex justify-between items-center">
                                 <div>
                                    <p className="font-medium text-[var(--campus-text-primary)]">{q.title}</p>
                                    <p className="text-xs text-[var(--campus-text-secondary)]">Reward: ₹{q.reward}</p>
                                 </div>
                                 <span className={`text-xs px-2 py-1 rounded ${
                                    q.status === 'open' ? 'bg-yellow-500/20 text-yellow-500' : 
                                    q.status === 'disputed' ? 'bg-red-500/20 text-red-500' :
                                    q.status === 'resolved' ? 'bg-green-500/20 text-green-500' :
                                    'bg-blue-500/20 text-blue-500'
                                 }`}>
                                    {q.status.toUpperCase()}
                                 </span>
                             </div>

                             {q.status === 'open' && (
                                <div className="flex justify-end mt-2">
                                    <button 
                                        onClick={() => onCancelQuest(q._id)}
                                        className="text-red-500 text-xs hover:underline flex items-center gap-1"
                                    >
                                        <Trash2 className="w-3 h-3" /> Cancel Quest
                                    </button>
                                </div>
                             )}

                             {q.status === 'open' && q.bids && q.bids.length > 0 && (
                                 <BidList bids={q.bids} onAccept={(hero: string, amt: number) => handleAcceptBid(q._id, hero, amt)} />
                             )}
                          </div>
                       ))}
                    </div>
                 ) : (
                    <p className="text-sm text-[var(--campus-text-secondary)] italic">You haven't asked for help yet.</p>
                 )}
              </div>
           </div>

           <div>
              <h2 className="text-xl font-bold text-[var(--campus-text-primary)] mb-4">Recent Activity</h2>
              <div className="bg-[var(--campus-card-bg)] border border-[var(--campus-border)] rounded-2xl overflow-hidden">
                 {activityLog.length > 0 ? (
                    <div className="divide-y divide-[var(--campus-border)]">
                       {activityLog.map((quest, i) => (
                          <div 
                            key={i} 
                            onClick={() => setFocusedQuestId(focusedQuestId === quest._id ? null : quest._id)}
                            className={`p-4 flex flex-col gap-2 transition-all cursor-pointer border-l-4 rounded-r-xl mb-2 ${
                                quest.status === 'disputed' 
                                    ? 'bg-red-500/10 border-red-500' 
                                    : quest.status === 'resolved'
                                    ? 'bg-green-500/10 border-green-500'
                                    : focusedQuestId === quest._id 
                                        ? 'bg-[var(--campus-surface)] border-[#2D7FF9]' 
                                        : 'hover:bg-[var(--campus-surface)] border-transparent'
                            }`}
                          >
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                   <div className={`p-2 rounded-full ${
                                       quest.status === 'disputed' ? 'bg-red-500/20 text-red-500' :
                                       quest.status === 'resolved' ? 'bg-green-500/20 text-green-500' :
                                       'bg-green-500/10 text-green-500'
                                   }`}>
                                      {quest.status === 'disputed' ? <AlertTriangle className="w-5 h-5"/> : <CheckCircle2 className="w-5 h-5" />}
                                   </div>
                                   <div>
                                      <p className="font-medium text-[var(--campus-text-primary)]">{quest.title}</p>
                                      <p className="text-xs text-[var(--campus-text-secondary)]">Hero: {quest.assignedTo}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-[#00F5D4] block">+₹{quest.reward}</span>
                                    <span className={`text-[10px] uppercase font-bold ${
                                        quest.status === 'disputed' ? 'text-red-500' : 
                                        quest.status === 'resolved' ? 'text-green-500' :
                                        'text-[var(--campus-text-secondary)]'
                                    }`}>
                                        {quest.status}
                                    </span>
                                </div>
                             </div>

                             {focusedQuestId === quest._id && !['disputed', 'resolved'].includes(quest.status) && (
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--campus-border)] animate-in fade-in slide-in-from-top-1">
                                    <span className="text-xs text-[var(--campus-text-secondary)] italic">Something wrong?</span>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white text-xs h-8"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDispute(quest);
                                        }}
                                    >
                                        Raise Dispute
                                    </Button>
                                </div>
                             )}
                             
                             {focusedQuestId === quest._id && quest.dispute?.adminComment && (
                                <div className="mt-2 p-2 bg-black/20 rounded text-xs text-[var(--campus-text-secondary)] border border-[var(--campus-border)]">
                                    <span className="font-bold text-[var(--campus-text-primary)]">Admin Update:</span> {quest.dispute.adminComment}
                                </div>
                             )}
                             
                             {quest.status === 'completed' && !quest.ratingGiven && quest.postedBy === currentUser?.username && (
                                <div className="flex items-center justify-end gap-2 mt-2">
                                    <span className="text-xs text-[var(--campus-text-secondary)]">Rate Hero:</span>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRateHero(quest._id, star);
                                            }}
                                            className="text-yellow-500 hover:scale-125 transition-transform"
                                        >
                                            <Star className="w-4 h-4 fill-current" />
                                        </button>
                                    ))}
                                </div>
                             )}
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

function BidList({ bids, onAccept }: any) {
    const [sortBy, setSortBy] = useState<'time' | 'rating' | 'lowest' | 'highest'>('time');

    const uniqueBidders = useMemo(() => {
        return Array.from(new Set(bids.map((b: any) => b.heroUsername)));
    }, [bids]);

    const sortedBids = useMemo(() => {
        const withAlias = bids.map((bid: any) => ({
            ...bid,
            alias: `Hero ${uniqueBidders.indexOf(bid.heroUsername) + 1}`
        }));

        return withAlias.sort((a: any, b: any) => {
            switch(sortBy) {
                case 'rating': return (b.rating || 0) - (a.rating || 0);
                case 'lowest': return a.amount - b.amount;
                case 'highest': return b.amount - a.amount;
                case 'time': default: return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            }
        });
    }, [bids, sortBy, uniqueBidders]);

    return (
        <div className="mt-3 pt-3 border-t border-[var(--campus-border)] animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-bold text-[var(--campus-text-secondary)]">INCOMING BIDS ({bids.length})</p>
                
                <div className="relative">
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="appearance-none text-xs bg-[var(--campus-bg)] border border-[var(--campus-border)] rounded pl-2 pr-6 py-1 text-[var(--campus-text-secondary)] focus:border-[#2D7FF9] outline-none cursor-pointer"
                    >
                        <option value="time">Newest</option>
                        <option value="rating">Best Rating</option>
                        <option value="lowest">Cheapest</option>
                        <option value="highest">Highest Pay</option>
                    </select>
                    <ArrowUpDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--campus-text-secondary)] pointer-events-none" />
                </div>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                {sortedBids.map((bid: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between bg-[var(--campus-bg)] p-2 rounded-lg border border-[var(--campus-border)] hover:border-[#2D7FF9]/30 transition-colors">
                        <div className="flex flex-col">
                            <div className="text-sm flex items-center gap-2">
                                <span className="text-[var(--campus-text-primary)] font-bold">{bid.alias}</span>
                                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                                    (bid.rating || 5) >= 4.5 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-[var(--campus-border)] text-[var(--campus-text-secondary)]'
                                }`}>
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>{bid.rating ? bid.rating.toFixed(1) : "5.0"}</span>
                                </div>
                            </div>
                            <span className="text-[var(--campus-text-secondary)] text-xs mt-0.5">
                                {new Date(bid.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <span className="text-[#00F5D4] font-bold">₹{bid.amount}</span>
                            <button 
                                onClick={() => onAccept(bid.heroUsername, bid.amount)}
                                className="bg-green-500/20 hover:bg-green-500/30 text-green-500 text-xs px-3 py-1.5 rounded-md transition-colors font-bold"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                ))}
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
