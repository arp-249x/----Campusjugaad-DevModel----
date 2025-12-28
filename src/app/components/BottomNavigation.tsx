import { PlusCircle, Search, LayoutDashboard, Trophy } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "post", label: "Post", icon: PlusCircle },
    { id: "find", label: "Find", icon: Search },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "leaderboard", label: "Board", icon: Trophy },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--campus-surface)] backdrop-blur-xl border-t border-[var(--campus-border)] shadow-2xl">
      <div className="grid grid-cols-4 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-all ${
                isActive
                  ? "text-[#2D7FF9]"
                  : "text-[var(--campus-text-secondary)] hover:text-[var(--campus-text-primary)]"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`} />
              <span className="text-xs">{tab.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#2D7FF9] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
