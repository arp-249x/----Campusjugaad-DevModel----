import { CheckCircle2, Sparkles } from "lucide-react";
import { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-gradient-to-br from-[#1A1D21] to-[#0B0E14] rounded-3xl p-8 max-w-md w-full border border-[#2D7FF9]/30 shadow-2xl shadow-[#2D7FF9]/20 animate-in zoom-in duration-500">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#2D7FF9]/20 to-[#9D4EDD]/20 rounded-3xl blur-xl opacity-75" />

        <div className="relative flex flex-col items-center text-center space-y-6">
          {/* Success Icon with Animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#00F5D4]/20 rounded-full blur-2xl animate-pulse" />
            <CheckCircle2 className="w-24 h-24 text-[#00F5D4] animate-in zoom-in duration-700" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-white text-3xl">Quest Posted Successfully!</h2>
            <div className="flex items-center justify-center gap-2 text-[#9D4EDD]">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <p className="text-lg">Summoning Heroes in your vicinity...</p>
              <Sparkles className="w-5 h-5 animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>
          </div>

          {/* XP Gain */}
          <div className="bg-[#9D4EDD]/10 border border-[#9D4EDD]/30 rounded-xl px-6 py-3 animate-in slide-in-from-bottom duration-1000">
            <div className="flex items-center gap-2">
              <span className="text-[#9D4EDD]">+100 XP</span>
              <span className="text-gray-400 text-sm">Task Master Points Earned</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#2D7FF9] to-[#9D4EDD] animate-in slide-in-from-left duration-[3000ms]" />
          </div>
        </div>
      </div>
    </div>
  );
}
