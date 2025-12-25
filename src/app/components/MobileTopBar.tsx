import { Bell, Wallet, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "./ThemeContext";

interface MobileTopBarProps {
  onMenuClick?: () => void;
  onWalletClick?: () => void;
  onNotificationClick?: () => void;
}

export function MobileTopBar({ onMenuClick, onWalletClick, onNotificationClick }: MobileTopBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-16 z-50 backdrop-blur-xl bg-[var(--campus-bg)]/70 border-b border-[var(--campus-border)]">
      <div className="px-4 h-full flex items-center justify-between">
        {/* Left: Hamburger Menu */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-[var(--campus-border)] rounded-full transition-colors"
        >
          <Menu className="w-5 h-5 text-[var(--campus-text-primary)]" />
        </button>

        {/* Center: Logo */}
        <h1 className="text-xl bg-gradient-to-r from-[#2D7FF9] to-[#9D4EDD] bg-clip-text text-transparent">
          CampusJugaad
        </h1>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-[var(--campus-border)] rounded-full transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-[#FFD700]" />
            ) : (
              <Moon className="w-4 h-4 text-[#2D7FF9]" />
            )}
          </button>

          {/* Wallet - Hidden on very small screens */}
          <button
            onClick={onWalletClick}
            className="hidden xs:flex items-center gap-1 bg-[var(--campus-border)] backdrop-blur-md rounded-full px-2 py-1 border border-[var(--campus-border)]"
          >
            <Wallet className="w-3 h-3 text-[#00F5D4]" />
            <span className="text-xs text-[#00F5D4]">₹450</span>
          </button>

          {/* Notification Bell */}
          <button 
            onClick={onNotificationClick}
            className="relative p-2 hover:bg-[var(--campus-border)] rounded-full transition-colors"
          >
            <Bell className="w-4 h-4 text-[var(--campus-text-secondary)]" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
          </button>
        </div>
      </div>
    </div>
  );
}