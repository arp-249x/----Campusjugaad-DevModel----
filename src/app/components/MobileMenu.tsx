import { X, LogOut, Wallet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ThemeToggle } from "./ThemeToggle";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  user?: any; // Added
  onLogout?: () => void; // Added
}

export function MobileMenu({ isOpen, onClose, activeTab, onTabChange, user, onLogout }: MobileMenuProps) {
  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : "CJ";
  const displayName = user?.name || "Student";
  const email = user?.email || "student@campus.edu";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[var(--campus-bg)] md:hidden flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--campus-border)]">
        <span className="font-bold text-xl">Menu</span>
        <button onClick={onClose} className="p-2 hover:bg-[var(--campus-surface)] rounded-full">
          <X className="w-6 h-6 text-[var(--campus-text-primary)]" />
        </button>
      </div>

      {/* Profile Section */}
      <div className="p-6 flex flex-col items-center border-b border-[var(--campus-border)] bg-[var(--campus-surface)]/30">
        <Avatar className="h-20 w-20 border-4 border-[var(--campus-border)] mb-4">
          <AvatarImage src="/placeholder-avatar.jpg" />
          <AvatarFallback className="bg-gradient-to-br from-[#2D7FF9] to-[#9D4EDD] text-white text-2xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold text-[var(--campus-text-primary)]">{displayName}</h2>
        <p className="text-[var(--campus-text-secondary)]">{email}</p>
      </div>

      {/* Menu Links */}
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
        {["post", "find", "dashboard", "leaderboard"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              onTabChange(tab);
              onClose();
            }}
            className={`w-full text-left px-4 py-4 rounded-xl text-lg font-medium transition-colors ${
              activeTab === tab
                ? "bg-[var(--campus-primary)]/10 text-[#2D7FF9]"
                : "text-[var(--campus-text-secondary)] hover:bg-[var(--campus-surface)]"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}

        <div className="h-px bg-[var(--campus-border)] my-4" />

        <div className="flex items-center justify-between px-4 py-2">
            <span className="text-[var(--campus-text-primary)]">Dark Mode</span>
            <ThemeToggle />
        </div>

        <button 
           onClick={() => { onLogout?.(); onClose(); }}
           className="w-full text-left px-4 py-4 rounded-xl text-lg font-medium text-red-500 hover:bg-red-500/10 flex items-center gap-2 mt-4"
        >
            <LogOut className="w-5 h-5" /> Log Out
        </button>
      </div>
    </div>
  );
}