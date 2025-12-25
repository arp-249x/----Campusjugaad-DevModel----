import { CheckCircle2, MapPin } from "lucide-react";
import { useEffect } from "react";

interface ToastNotificationProps {
  isVisible: boolean;
  title: string;
  location?: string;
  onClose: () => void;
}

export function ToastNotification({ isVisible, title, location, onClose }: ToastNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[90] animate-in slide-in-from-top duration-500">
      <div className="bg-gradient-to-r from-[#00F5D4] to-[#00D4B8] text-black rounded-2xl px-6 py-4 shadow-2xl shadow-[#00F5D4]/40 border border-[#00F5D4]/50 max-w-md">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <div className="flex-1">
            <div className="font-medium">Quest Accepted!</div>
            {location && (
              <div className="flex items-center gap-1 text-sm opacity-90 mt-1">
                <MapPin className="w-3 h-3" />
                <span>Head to {location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
