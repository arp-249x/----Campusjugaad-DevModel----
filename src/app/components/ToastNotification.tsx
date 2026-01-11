import { useEffect, useState } from "react";
import { CheckCircle2, MapPin, X } from "lucide-react";

interface ToastNotificationProps {
  isVisible: boolean;
  title: string;
  location?: string;
  onClose: () => void;
}

export function ToastNotification({ isVisible, title, location, onClose }: ToastNotificationProps) {
  // Auto-Dismiss Timer
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Disappears after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 w-[90%] max-w-md">
      <div className="bg-[var(--campus-card-bg)]/90 backdrop-blur-md border border-[#00F5D4]/30 shadow-2xl rounded-2xl p-4 flex items-start gap-4">
        <div className="bg-[#00F5D4]/20 p-2 rounded-full shrink-0">
           <CheckCircle2 className="w-6 h-6 text-[#00F5D4]" />
        </div>
        <div className="flex-1 min-w-0">
           <h4 className="font-bold text-[var(--campus-text-primary)] text-lg">Quest Accepted!</h4>
           <p className="text-[var(--campus-text-secondary)] text-sm truncate">You are now working on <span className="text-[#00F5D4]">{title}</span></p>
           {location && (
             <div className="flex items-center gap-1 mt-1 text-xs text-[var(--campus-text-secondary)]">
                <MapPin className="w-3 h-3" /> {location}
             </div>
           )}
        </div>
        <button onClick={onClose} className="text-[var(--campus-text-secondary)] hover:text-[var(--campus-text-primary)]">
            <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
