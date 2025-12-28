import { X, MapPin, Clock, Coins, Zap, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface QuestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  quest: any;
  onApply: (questId: string, bid: number) => void;
  currentUser: any;
}

export function QuestDetailsModal({ isOpen, onClose, quest, onApply, currentUser }: QuestDetailsModalProps) {
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [bidAmount, setBidAmount] = useState<string>("");

  if (!isOpen || !quest) return null;

  const isMyQuest = quest.postedBy === currentUser?.username;
  const hasApplied = quest.applicants?.some((a: any) => a.heroUsername === currentUser?.username);

  const handleSendRequest = () => {
     const finalBid = isNegotiating && bidAmount ? parseInt(bidAmount) : quest.reward;
     onApply(quest._id, finalBid);
     onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[var(--campus-card-bg)] w-full max-w-lg rounded-3xl border border-[var(--campus-border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[var(--campus-border)] flex justify-between items-start bg-[var(--campus-surface)]">
            <div>
                <h2 className="text-2xl font-bold text-[var(--campus-text-primary)] mb-1 leading-tight">{quest.title}</h2>
                <div className="flex items-center gap-2 text-sm text-[var(--campus-text-secondary)]">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-medium uppercase text-xs tracking-wide">
                        {quest.urgency}
                    </span>
                    <span>•</span>
                    <span>Posted by {quest.postedBy}</span>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[var(--campus-border)] rounded-full transition-colors">
                <X className="w-6 h-6 text-[var(--campus-text-secondary)]" />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-[var(--campus-bg)] border border-[var(--campus-border)] flex flex-col items-center justify-center text-center">
                    <Clock className="w-5 h-5 text-[var(--campus-text-secondary)] mb-1" />
                    <span className="text-xs text-[var(--campus-text-secondary)]">Deadline</span>
                    <span className="font-semibold text-[var(--campus-text-primary)]">{quest.deadline}</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--campus-bg)] border border-[var(--campus-border)] flex flex-col items-center justify-center text-center">
                    <MapPin className="w-5 h-5 text-[var(--campus-text-secondary)] mb-1" />
                    <span className="text-xs text-[var(--campus-text-secondary)]">Location</span>
                    <span className="font-semibold text-[var(--campus-text-primary)] truncate w-full">{quest.location || "Remote"}</span>
                </div>
            </div>

            {/* Full Description */}
            <div>
                <h3 className="text-sm font-bold text-[var(--campus-text-secondary)] uppercase mb-2">Description</h3>
                <p className="text-[var(--campus-text-primary)] leading-relaxed whitespace-pre-wrap">
                    {quest.description}
                </p>
            </div>

            {/* Rewards */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#00F5D4]/10 border border-[#00F5D4]/20">
                <div className="flex items-center gap-3">
                    <div className="bg-[#00F5D4] p-2 rounded-full text-black">
                        <Coins className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-[#00F5D4] font-bold uppercase">Reward</p>
                        <p className="text-2xl font-bold text-[#00F5D4]">₹{quest.reward}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-[#9D4EDD] font-bold">
                    <Zap className="w-5 h-5" />
                    <span>+{quest.xp} XP</span>
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        {!isMyQuest && !hasApplied && (
            <div className="p-6 border-t border-[var(--campus-border)] bg-[var(--campus-surface)] space-y-4">
                
                {isNegotiating ? (
                    <div className="animate-in slide-in-from-bottom-2">
                        <label className="text-sm text-[var(--campus-text-secondary)] mb-1 block">Your Offer (₹)</label>
                        <div className="flex gap-2">
                            <Input 
                                type="number" 
                                placeholder={`Original: ₹${quest.reward}`}
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                className="bg-[var(--campus-bg)]"
                                autoFocus
                            />
                            <Button variant="outline" onClick={() => setIsNegotiating(false)}>Cancel</Button>
                        </div>
                    </div>
                ) : (
                   <p className="text-xs text-center text-[var(--campus-text-secondary)]">
                       You can accept the price or negotiate a new one.
                   </p>
                )}

                <div className="flex gap-3">
                    {!isNegotiating && (
                        <Button 
                            variant="outline" 
                            className="flex-1 border-[#2D7FF9] text-[#2D7FF9] hover:bg-[#2D7FF9]/10"
                            onClick={() => { setIsNegotiating(true); setBidAmount(quest.reward.toString()); }}
                        >
                            Negotiate
                        </Button>
                    )}
                    <Button 
                        className="flex-1 bg-[#2D7FF9] hover:bg-[#2D7FF9]/90 text-white font-bold py-6"
                        onClick={handleSendRequest}
                    >
                        {isNegotiating ? `Send Offer: ₹${bidAmount}` : `Apply for ₹${quest.reward}`}
                    </Button>
                </div>
            </div>
        )}

        {hasApplied && (
             <div className="p-6 border-t border-[var(--campus-border)] bg-[#2D7FF9]/10 text-center">
                 <p className="text-[#2D7FF9] font-bold flex items-center justify-center gap-2">
                     <CheckCircle2 className="w-5 h-5"/> Application Sent
                 </p>
                 <p className="text-xs text-[var(--campus-text-secondary)] mt-1">Waiting for Task Master to accept.</p>
             </div>
        )}

        {isMyQuest && (
            <div className="p-6 border-t border-[var(--campus-border)] text-center text-[var(--campus-text-secondary)] text-sm italic">
                This is your quest. Manage applicants in Dashboard.
            </div>
        )}

      </div>
    </div>
  );
}