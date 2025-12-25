import { Clock, MapPin, Coins, Zap } from "lucide-react";

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
}: QuestCardProps) {
  const urgencyConfig = {
    low: {
      label: "Chill",
      color: "#2D7FF9",
      bg: "bg-[#2D7FF9]/10",
      border: "border-[#2D7FF9]/30",
      text: "text-[#2D7FF9]",
    },
    medium: {
      label: "Normal",
      color: "#9D4EDD",
      bg: "bg-[#9D4EDD]/10",
      border: "border-[#9D4EDD]/30",
      text: "text-[#9D4EDD]",
    },
    urgent: {
      label: "URGENT",
      color: "#FF4800",
      bg: "bg-[#FF4800]/10",
      border: "border-[#FF4800]/30",
      text: "text-[#FF4800]",
    },
  };

  const config = urgencyConfig[urgency];

  return (
    <div
      className={`relative bg-[var(--campus-card-bg)] rounded-2xl p-6 border transition-all hover:scale-[1.02] hover:shadow-xl group ${
        highlighted
          ? "border-[#FFD700] shadow-lg shadow-[#FFD700]/20"
          : "border-[var(--campus-border)] hover:border-[var(--campus-border)]"
      }`}
    >
      {/* Highlighted Badge */}
      {highlighted && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-4 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <Zap className="w-4 h-4" fill="currentColor" />
          <span className="text-xs">Highest Pay</span>
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-[var(--campus-text-primary)] pr-4">{title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs ${config.bg} ${config.border} ${config.text} border shrink-0`}
        >
          {config.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-[var(--campus-text-secondary)] text-sm mb-4 line-clamp-2">{description}</p>

      {/* Meta Information */}
      <div className="flex items-center gap-4 mb-4 text-sm text-[var(--campus-text-secondary)]">
        {deadline && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{deadline}</span>
          </div>
        )}
        {location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--campus-border)]">
        {/* Reward */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Coins className="w-5 h-5 text-[#00F5D4]" />
            <span className="text-[#00F5D4]">₹{reward}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-[#9D4EDD]" />
            <span className="text-[#9D4EDD] text-sm">+{xp} XP</span>
          </div>
        </div>

        {/* Accept Button */}
        <button
          onClick={onAccept}
          disabled={isAccepted}
          className={`px-6 py-2 rounded-lg transition-all ${
            isAccepted
              ? "bg-[var(--campus-border)] text-[var(--campus-text-secondary)] cursor-not-allowed"
              : highlighted
              ? "bg-[#FFD700] text-black hover:bg-[#FFD700]/80"
              : "bg-[#2D7FF9] text-white hover:bg-[#2D7FF9]/80"
          }`}
        >
          {isAccepted ? "Accepted" : "Accept Quest"}
        </button>
      </div>

      {/* Glow effect on hover */}
      <div
        className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity -z-10 ${
          highlighted ? "bg-[#FFD700]" : "bg-[#2D7FF9]"
        }`}
      ></div>
    </div>
  );
}