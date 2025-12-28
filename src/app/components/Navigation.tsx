import { Search, Plus, Bell, Wallet, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileDropdown } from "./ProfileDropdown";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMenuClick: () => void;
  onWalletClick: () => void;
  onNotificationClick: () => void;
  balance: number;
  user?: any; 
  onLogout?: () => void;
  notificationCount?: number;
}

export function Navigation({ 
  activeTab, 
  onTabChange, 
  onMenuClick, 
  onWalletClick, 
  onNotificationClick,
  balance,
  user,
  onLogout,
  notificationCount = 0
}: NavigationProps) {
  return (
    <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-[var(--campus-nav-bg)] backdrop-blur-md border-b border-[var(--campus-border)] h-20 px-8 items-center justify-between">
      
      {/* 1. Left: Logo Area */}
      <div className="flex-1 flex items-center justify-start">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange("dashboard")}>
          <div className="w-10 h-10 bg-gradient-to-br from-[#2D7FF9] to-[#9D4EDD] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#2D7FF9]/20">
            CJ
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[#2D7FF9] to-[#9D4EDD] bg-clip-text text-transparent">
            CampusJugaad
          </span>
        </div>
      </div>

      {/* 2. Center: Navigation Links */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-1 bg-[var(--campus-surface)] p-1 rounded-xl border border-[var(--campus-border)]">
          {["post", "find", "dashboard", "leaderboard"].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-[var(--campus-bg)] text-[var(--campus-text-primary)] shadow-sm"
                  : "text-[var(--campus-text-secondary)] hover:text-[var(--campus-text-primary)] hover:bg-[var(--campus-bg)]/50"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Right: Actions & Profile */}
      <div className="flex-1 flex items-center justify-end gap-4">
        {/* Wallet Pill */}
        <button 
          onClick={onWalletClick}
          className="flex items-center gap-2 bg-[var(--campus-surface)] hover:bg-[var(--campus-border)] border border-[var(--campus-border)] rounded-full px-4 py-1.5 transition-all group"
        >
          <div className="w-6 h-6 rounded-full bg-[#00F5D4]/20 flex items-center justify-center">
             <Wallet className="w-3.5 h-3.5 text-[#00F5D4]" />
          </div>
          <span className="font-mono font-bold text-[var(--campus-text-primary)]">₹{balance}</span>
        </button>

        <div className="w-px h-8 bg-[var(--campus-border)] mx-2" />

        <button onClick={onNotificationClick} className="p-2.5 text-[var(--campus-text-secondary)] hover:text-[var(--campus-text-primary)] hover:bg-[var(--campus-surface)] rounded-xl transition-all relative">
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--campus-nav-bg)] animate-pulse"></span>
          )}
        </button>
        
        <ThemeToggle />
        
        {/* Profile Dropdown with Logout */}
        <ProfileDropdown user={user} onLogout={onLogout} />
      </div>
    </nav>
  );
}