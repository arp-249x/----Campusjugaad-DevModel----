import { X } from "lucide-react";
import { motion } from "motion/react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function MobileMenu({ isOpen, onClose, activeTab, onTabChange }: MobileMenuProps) {
  const tabs = [
    { id: "post", label: "Post a Quest" },
    { id: "find", label: "Find Quests" },
    { id: "dashboard", label: "My Dashboard" },
    { id: "leaderboard", label: "Leaderboard" },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Menu */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-full w-80 bg-[var(--campus-bg)] border-r border-[var(--campus-border)] z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="px-6 py-6 border-b border-[var(--campus-border)] flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-[#2D7FF9] to-[#9D4EDD] bg-clip-text text-transparent">
            CampusJugaad
          </h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--campus-border)] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[var(--campus-text-secondary)]" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="py-4 px-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition-all ${
                activeTab === tab.id
                  ? "bg-[#2D7FF9] text-white shadow-lg shadow-[#2D7FF9]/30"
                  : "text-[var(--campus-text-secondary)] hover:text-[var(--campus-text-primary)] hover:bg-[var(--campus-border)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[var(--campus-border)] bg-[var(--campus-bg)]">
          <p className="text-sm text-[var(--campus-text-secondary)] text-center">
            Campus Jugaad v3.0
          </p>
        </div>
      </motion.div>
    </>
  );
}
