import { Clock, MessageCircle, CheckCircle2, X } from "lucide-react";
import { useState, useEffect } from "react";

interface ActiveQuest {
  title: string;
  location?: string;
  duration: number; // in seconds
}

interface ActiveQuestBarProps {
  quest: ActiveQuest | null;
  onComplete?: () => void;
  onDismiss?: () => void;
}

export function ActiveQuestBar({ quest, onComplete, onDismiss }: ActiveQuestBarProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (quest) {
      setTimeLeft(quest.duration);
    }
  }, [quest]);

  useEffect(() => {
    if (timeLeft <= 0 || !quest) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quest]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!quest) return null;

  return (
    <div className="fixed bottom-0 md:bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-[#2D7FF9] to-[#9D4EDD] border-t border-white/20 shadow-2xl shadow-[#2D7FF9]/30 backdrop-blur-xl animate-in slide-in-from-bottom duration-500 mb-16 md:mb-0">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 md:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          {/* Left: Quest Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex items-center gap-2 text-white min-w-0">
              <span className="hidden sm:inline text-sm opacity-80">Active Quest:</span>
              <span className="font-medium truncate">{quest.title}</span>
              {quest.location && (
                <span className="hidden md:inline text-sm opacity-80">→ {quest.location}</span>
              )}
            </div>
          </div>

          {/* Center: Timer */}
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-lg border border-white/20">
            <Clock className="w-4 h-4 text-white" />
            <span className="text-white font-mono text-sm md:text-base">{formatTime(timeLeft)}</span>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onComplete}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#00F5D4] hover:bg-[#00F5D4]/90 text-black rounded-lg transition-all hover:scale-105 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Complete</span>
            </button>
            <button
              onClick={onDismiss}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}