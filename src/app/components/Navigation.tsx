import { Bell, Wallet, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { ProfileDropdown } from "./ProfileDropdown";
import { useState } from "react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMenuClick?: () => void;
  onWalletClick?: () => void;
  onNotificationClick?: () => void;
}

export function Navigation({ 
  activeTab, 
  onTabChange, 
  onMenuClick,
  onWalletClick,
  onNotificationClick 
}: NavigationProps) {
  const { theme, toggleTheme } = useTheme();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const tabs = [
    { id: "post", label: "Post a Quest" },
    { id: "find", label: "Find Quests" },
    { id: "dashboard", label: "My Dashboard" },
    { id: "leaderboard", label: "Leaderboard" },
  ];

  return (
    <nav className="hidden md:block fixed top-0 left-0 right-0 h-20 z-50 backdrop-blur-xl bg-[var(--campus-bg)]/70 border-b border-[var(--campus-border)]">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu for Tablet */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-[var(--campus-border)] rounded-full transition-colors"
          >
            <Menu className="w-5 h-5 text-[var(--campus-text-primary)]" />
          </button>
          
          <h1 className="bg-gradient-to-r from-[#2D7FF9] to-[#9D4EDD] bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform text-2xl md:text-3xl">
            CampusJugaad
          </h1>
        </div>

        {/* Center Navigation Tabs - Hide on smaller screens, show on desktop */}
        <div className="hidden lg:flex items-center gap-2 bg-[var(--campus-border)] backdrop-blur-md rounded-full p-1.5 border border-[var(--campus-border)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 xl:px-6 py-2 rounded-full transition-all duration-300 text-sm xl:text-base ${
                activeTab === tab.id
                  ? "bg-[#2D7FF9] text-white shadow-lg shadow-[#2D7FF9]/30"
                  : "text-[var(--campus-text-secondary)] hover:text-[var(--campus-text-primary)] hover:bg-[var(--campus-border)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: User Profile Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-[var(--campus-border)] rounded-full transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-[#FFD700]" />
            ) : (
              <Moon className="w-5 h-5 text-[#2D7FF9]" />
            )}
          </button>

          {/* Wallet */}
          <button
            onClick={onWalletClick}
            className="hidden sm:flex items-center gap-2 bg-[var(--campus-border)] backdrop-blur-md rounded-full px-4 py-2 border border-[var(--campus-border)] hover:border-[#00F5D4]/30 transition-all cursor-pointer"
          >
            <Wallet className="w-4 h-4 text-[#00F5D4]" />
            <span className="text-[#00F5D4]">₹450</span>
          </button>

          {/* Notification Bell */}
          <button 
            onClick={onNotificationClick}
            className="relative p-2 hover:bg-[var(--campus-border)] rounded-full transition-colors"
          >
            <Bell className="w-5 h-5 text-[var(--campus-text-secondary)] hover:text-[var(--campus-text-primary)] transition-colors" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 hover:bg-[var(--campus-border)] px-3 py-2 rounded-full transition-colors cursor-pointer"
            >
              <span className="hidden md:inline text-[var(--campus-text-primary)]">Hello, Rishav</span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D7FF9] to-[#9D4EDD] flex items-center justify-center hover:scale-110 transition-transform">
                <span className="text-white">R</span>
              </div>
            </button>
            
            <ProfileDropdown
              isOpen={showProfileDropdown}
              onClose={() => setShowProfileDropdown(false)}
              onNavigate={(action) => console.log("Navigate to:", action)}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}