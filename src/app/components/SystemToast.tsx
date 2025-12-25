import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SystemToastProps {
  isVisible: boolean;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
  onClose: () => void;
  duration?: number;
}

export function SystemToast({
  isVisible,
  type,
  title,
  message,
  onClose,
  duration = 4000,
}: SystemToastProps) {
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-[#00F5D4]",
      textColor: "text-[#00F5D4]",
      borderColor: "border-[#00F5D4]",
    },
    error: {
      icon: AlertCircle,
      bgColor: "bg-red-500",
      textColor: "text-red-500",
      borderColor: "border-red-500",
    },
    info: {
      icon: Info,
      bgColor: "bg-[#2D7FF9]",
      textColor: "text-[#2D7FF9]",
      borderColor: "border-[#2D7FF9]",
    },
  };

  const { icon: Icon, bgColor, textColor, borderColor } = config[type];

  // Auto-close after duration
  if (isVisible && duration > 0) {
    setTimeout(() => {
      onClose();
    }, duration);
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md px-4"
        >
          <div
            className={`bg-[var(--campus-card-bg)] backdrop-blur-xl border-2 ${borderColor} rounded-xl shadow-2xl p-4 flex items-start gap-3`}
          >
            {/* Icon */}
            <div className={`${bgColor} rounded-lg p-2 shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`${textColor} mb-1`}>{title}</h3>
              {message && (
                <p className="text-[var(--campus-text-secondary)] text-sm">{message}</p>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 hover:bg-[var(--campus-border)] rounded transition-colors shrink-0"
            >
              <X className="w-4 h-4 text-[var(--campus-text-secondary)]" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
