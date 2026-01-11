import { Clock, MapPin, Coins, Zap, ChevronDown, ChevronUp, Gavel, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function QuestCard({
  title, description, reward, xp, urgency, deadline, location, 
  highlighted = false, onAccept, isAccepted = false, isMyQuest = false, 
  currentUser 
}: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState(reward); 

  const config = { 
    low: { label: "Chill", color: "#2D7FF9", bg: "bg-[#2D7FF9]/10", border: "border-[#2D7FF9]/30", text: "text-[#2D7FF9]" },
    medium: { label: "Normal", color: "#9D4EDD", bg: "bg-[#9D4EDD]/10", border: "border-[#9D4EDD]/30", text: "text-[#9D4EDD]" },
    urgent: { label: "URGENT", color: "#FF4800", bg: "bg-[#FF4800]/10", border: "border-[#FF4800]/30", text: "text-[#FF4800]" },
  }[urgency as "low" | "medium" | "urgent"];

  const handleBidSubmit = (e: any) => {
    e.stopPropagation();
    onAccept?.(bidAmount); 
    setIsBidding(false);
  };

  //Confirmation Dialog
  const handleDirectAccept = (e: any) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to accept "${title}" for ₹${reward}?`)) {
        onAccept?.(); 
    }
  };

  return (
    <div onClick={() => setIsExpanded(!isExpanded)} className={`relative bg-[var(--campus-card-bg)] rounded-2xl p-6 border transition-all hover:scale-[1.01] hover:shadow-xl group cursor-pointer ${highlighted ? "border-[#FFD700]" : "border-[var(--campus-border)]"}`}>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-[var(--campus-text-primary)] pr-4 font-semibold text-lg leading-tight">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs ${config.bg} ${config.border} ${config.text} border shrink-0 font-medium`}>{config.label}</span>
      </div>
      
       <div className={`text-[var(--campus-text-secondary)] text-sm transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-[3rem] opacity-80'}`}>
          {description}
       </div>
       
       <div className="flex items-center gap-4 mb-4 mt-2 text-sm text-[var(--campus-text-secondary)]">
        {deadline && <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /><span>{deadline}</span></div>}
        {location && <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /><span>{location}</span></div>}
      </div>

      {/* Footer / Action Area */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--campus-border)] mt-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Coins className="w-5 h-5 text-[#00F5D4]" />
            <span className="text-[#00F5D4] font-bold">₹{reward}</span>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
            
            {(isMyQuest || isAccepted) ? (
                <button
                    disabled
                    className="px-6 py-2 rounded-lg font-medium text-sm bg-[var(--campus-border)] text-[var(--campus-text-secondary)] cursor-not-allowed"
                >
                    {isMyQuest ? "Your Quest" : "Accepted"}
                </button>
            ) : isBidding ? (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                    <input 
                        type="number" 
                        value={bidAmount}
                        onChange={(e) => setBidAmount(parseInt(e.target.value))}
                        className="w-20 px-2 py-1 rounded bg-[var(--campus-bg)] border border-[var(--campus-border)] text-sm focus:outline-none focus:border-[#2D7FF9]"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button 
                        onClick={handleBidSubmit}
                        className="bg-[#2D7FF9] text-white px-3 py-1 rounded-md text-sm font-bold hover:bg-[#2D7FF9]/80"
                    >
                        ✓
                    </button>
                    <button 
                        onClick={() => setIsBidding(false)}
                        className="text-red-500 px-2 text-sm hover:bg-red-500/10 rounded"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDirectAccept}
                        className="px-4 py-2 rounded-lg transition-all font-medium text-sm bg-[#00F5D4] text-black hover:bg-[#00F5D4]/80 flex items-center gap-1"
                    >
                        <CheckCircle2 className="w-4 h-4" /> Accept
                    </button>
                    <button
                        onClick={() => setIsBidding(true)}
                        className="px-4 py-2 rounded-lg transition-all font-medium text-sm bg-[var(--campus-surface)] border border-[var(--campus-border)] text-[var(--campus-text-primary)] hover:bg-[var(--campus-border)] flex items-center gap-1"
                    >
                        <Gavel className="w-4 h-4" /> Bid
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
