import { Clock, MapPin, Coins, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface QuestCardProps {
  title: string;
  description: string;
  reward: number;
  xp: number;
  urgency: "low" | "medium" | "urgent";
  deadline: string;
  location?: string;
  highlighted?: boolean;
  onAccept?: () => void;
  isAccepted?: boolean;
  isMyQuest?: boolean;
}

export function QuestCard({
  title,
  description,
  reward,
  xp,
  urgency,
  deadline,
  location,
  highlighted = false,
  onAccept,
  isAccepted = false,
  isMyQuest = false,
}: QuestCardProps) {
  // 1. STATE: Tracks if card is open or closed
  const [isExpanded, setIsExpanded] = useState(false);

  const urgencyConfig = {
    low: { label: "Chill", color: "#2D7FF9", bg: "bg-[#2D7FF9]/10", border: "border-[#2D7FF9]/30", text: "text-[#2D7FF9]" },
    medium: { label: "Normal", color: "#9D4EDD", bg: "bg-[#9D4EDD]/10", border: "border-[#9D4EDD]/30", text: "text-[#9D4EDD]" },
    urgent: { label: "URGENT", color: "#FF4800", bg: "bg-[#FF4800]/10", border: "border-[#FF4800]/30", text: "text-[#FF4800]" },
  };

  const config = urgencyConfig[urgency];

  return (
    <div
      // 2. TRIGGER: Click anywhere on card toggles expansion
      onClick={() => setIsExpanded(!isExpanded)}
      className={`relative bg-[var(--campus-card-bg)] rounded-2xl p-6 border transition-all hover:scale-[1.01] hover:shadow-xl group cursor-pointer ${
        highlighted
          ? "border-[#FFD700] shadow-lg shadow-[#FFD700]/20"
          : "border-[var(--campus-border)] hover:border-[var(--campus-border)]"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-4 py-1 rounded-full flex items-center gap-1 shadow-lg z-10">
          <Zap className="w-4 h-4" fill="currentColor" />
          <span className="text-xs font-bold">Highest Pay</span>
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-[var(--campus-text-primary)] pr-4 font-semibold text-lg leading-tight">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs ${config.bg} ${config.border} ${config.text} border shrink-0 font-medium`}>
          {config.label}
        </span>
      </div>

      {/* 3. EXPANDABLE DESCRIPTION AREA */}
      <div className="relative mb-4">
        <div 
          className={`text-[var(--campus-text-secondary)] text-sm transition-all duration-300 ease-in-out overflow-hidden ${
             // LOGIC: If expanded, allow tall height. If not, force 3rem (approx 2 lines) height.
             isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-[3rem] opacity-80'
          }`}
        >
          {description}
        </div>
        
        {/* Visual Fade effect when closed */}
        {!isExpanded && description.length > 80 && (
          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[var(--campus-card-bg)] to-transparent pointer-events-none"></div>
        )}
      </div>

      {/* Meta Information */}
      <div className="flex items-center gap-4 mb-4 text-sm text-[var(--campus-text-secondary)]">
        {deadline && (
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{deadline}</span>
          </div>
        )}
        {location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{location}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--campus-border)] mt-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Coins className="w-5 h-5 text-[#00F5D4]" />
            <span className="text-[#00F5D4] font-bold">₹{reward}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-[#9D4EDD]" />
            <span className="text-[#9D4EDD] text-sm">+{xp} XP</span>
          </div>
        </div>

        {/* 4. BUTTON LOGIC: Stop click from triggering card expansion */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // <--- Crucial: Prevents card from closing/opening when clicking "Accept"
            onAccept?.();
          }}
          disabled={isAccepted || isMyQuest}
          className={`px-6 py-2 rounded-lg transition-all font-medium text-sm shadow-md z-10 ${
            isAccepted || isMyQuest
              ? "bg-[var(--campus-border)] text-[var(--campus-text-secondary)] cursor-not-allowed"
              : highlighted
              ? "bg-[#FFD700] text-black hover:bg-[#FFD700]/80"
              : "bg-[#2D7FF9] text-white hover:bg-[#2D7FF9]/80"
          }`}
        >
          {isMyQuest ? "Your Quest" : isAccepted ? "Accepted" : "Accept Quest"}
        </button>
      </div>

      {/* Expansion Indicator Arrow */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[var(--campus-text-secondary)] opacity-50 pointer-events-none">
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>
    </div>
  );
}