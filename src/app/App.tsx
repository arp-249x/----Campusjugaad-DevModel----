import { useState } from "react";
import { ThemeProvider } from "./components/ThemeContext";
import { ToastProvider } from "./components/ToastContext";
import { Navigation } from "./components/Navigation";
import { MobileTopBar } from "./components/MobileTopBar";
import { BottomNavigation } from "./components/BottomNavigation";
import { TaskMasterView } from "./components/TaskMasterView";
import { HeroView } from "./components/HeroView";
import { DashboardView } from "./components/DashboardView";
import { LeaderboardView } from "./components/LeaderboardView";
import { ActiveQuestBar } from "./components/ActiveQuestBar";
import { MobileMenu } from "./components/MobileMenu";
import { WalletOverlay } from "./components/WalletOverlay";
import { NotificationPanel } from "./components/NotificationPanel";

export default function App() {
  const [activeTab, setActiveTab] = useState("post");
  const [activeQuest, setActiveQuest] = useState<{
    title: string;
    location?: string;
    duration: number;
  } | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showWalletOverlay, setShowWalletOverlay] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  const handleAcceptQuest = (quest: any) => {
    setActiveQuest({
      title: quest.title,
      location: quest.location,
      duration: 7185, // 1:59:45 in seconds - this would be calculated based on deadline
    });
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-[var(--campus-bg)] relative overflow-x-hidden transition-colors duration-300">
          {/* Animated Background - Only visible in dark mode */}
          <div className="dark:block hidden fixed inset-0 overflow-hidden pointer-events-none">
            {/* Gradient Orbs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2D7FF9]/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#9D4EDD]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#00F5D4]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Desktop Navigation */}
            <Navigation 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              onMenuClick={() => setShowMobileMenu(true)}
              onWalletClick={() => setShowWalletOverlay(true)}
              onNotificationClick={() => setShowNotificationPanel(true)}
            />
            
            {/* Mobile Top Bar */}
            <MobileTopBar 
              onMenuClick={() => setShowMobileMenu(true)}
              onWalletClick={() => setShowWalletOverlay(true)}
              onNotificationClick={() => setShowNotificationPanel(true)}
            />

            {/* Main Content Area */}
            {activeTab === "post" && <TaskMasterView />}
            {activeTab === "find" && <HeroView onAcceptQuest={handleAcceptQuest} />}
            {activeTab === "dashboard" && <DashboardView />}
            {activeTab === "leaderboard" && <LeaderboardView />}

            {/* Mobile Bottom Navigation */}
            <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Active Quest Bar - Only show when quest is accepted */}
          {activeQuest && (
            <ActiveQuestBar 
              quest={activeQuest}
              onComplete={() => setActiveQuest(null)}
              onDismiss={() => setActiveQuest(null)}
            />
          )}

          {/* Mobile Menu */}
          <MobileMenu
            isOpen={showMobileMenu}
            onClose={() => setShowMobileMenu(false)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Wallet Overlay */}
          <WalletOverlay
            isOpen={showWalletOverlay}
            onClose={() => setShowWalletOverlay(false)}
          />

          {/* Notification Panel */}
          <NotificationPanel
            isOpen={showNotificationPanel}
            onClose={() => setShowNotificationPanel(false)}
          />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}