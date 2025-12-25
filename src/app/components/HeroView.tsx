import { ArrowUpDown, ListFilter, MapPin } from "lucide-react";
import { QuestCard } from "./QuestCard";
import { useState } from "react";
import { ToastNotification } from "./ToastNotification";
import { SkeletonLoader } from "./SkeletonLoader";
import { EmptyState } from "./EmptyState";

interface Quest {
  title: string;
  description: string;
  reward: number;
  xp: number;
  urgency: "low" | "medium" | "urgent";
  deadline: string;
  location?: string;
  highlighted?: boolean;
}

interface HeroViewProps {
  onAcceptQuest?: (quest: Quest) => void;
}

export function HeroView({ onAcceptQuest }: HeroViewProps) {
  const [showToast, setShowToast] = useState(false);
  const [acceptedQuest, setAcceptedQuest] = useState<Quest | null>(null);
  const [acceptedQuestIds, setAcceptedQuestIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  const quests: Quest[] = [
    {
      title: "Hold Canteen Line Spot",
      description: "Stand in the lunch queue for me for 20 mins.",
      reward: 150,
      xp: 50,
      urgency: "medium" as const,
      deadline: "Today, 2 PM",
      location: "Main Canteen",
    },
    {
      title: "Deliver Lab Coat ASAP",
      description: "Forgot my coat at Hostel 4. Need it at Chem Lab now!",
      reward: 250,
      xp: 75,
      urgency: "urgent" as const,
      deadline: "In 30 Mins",
      location: "Hostel 4 → Chem Lab",
    },
    {
      title: "Tutoring Session: Calculus II",
      description: "2-hour session to prep for midterm exam.",
      reward: 600,
      xp: 200,
      urgency: "low" as const,
      deadline: "Tomorrow, 5 PM",
      location: "Library",
      highlighted: true,
    },
    {
      title: "Print Assignment",
      description: "Print 10 pages and deliver to Block A, Room 204.",
      reward: 100,
      xp: 30,
      urgency: "medium" as const,
      deadline: "Today, 4 PM",
      location: "Block A",
    },
    {
      title: "Wake Me Up Call",
      description: "Call me at 6 AM for morning class. I'm a heavy sleeper!",
      reward: 80,
      xp: 25,
      urgency: "low" as const,
      deadline: "Tomorrow, 6 AM",
    },
    {
      title: "Submit Assignment",
      description: "Submit my assignment to the faculty office before 12 PM.",
      reward: 200,
      xp: 60,
      urgency: "urgent" as const,
      deadline: "Today, 11:30 AM",
      location: "Faculty Office",
    },
    {
      title: "Buy Snacks from Canteen",
      description: "Get me 2 samosas and a cold coffee during break.",
      reward: 120,
      xp: 40,
      urgency: "low" as const,
      deadline: "Today, 3 PM",
      location: "Canteen",
    },
    {
      title: "Take Notes in Class",
      description: "Attend CS101 lecture and share detailed notes.",
      reward: 300,
      xp: 100,
      urgency: "medium" as const,
      deadline: "Today, 10 AM",
      location: "Room 301",
    },
    {
      title: "Return Library Book",
      description: "Return 'Data Structures' book to library before due date.",
      reward: 90,
      xp: 35,
      urgency: "medium" as const,
      deadline: "Tomorrow, 6 PM",
      location: "Library",
    },
  ];

  const handleAcceptQuest = (quest: Quest, index: number) => {
    setAcceptedQuest(quest);
    setShowToast(true);
    setAcceptedQuestIds(prev => new Set(prev).add(quest.title));
    onAcceptQuest?.(quest);
  };

  // Demo functions for testing loading and empty states
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleClearFilters = () => {
    setShowEmpty(false);
  };

  return (
    <div className="min-h-screen pt-16 md:pt-28 pb-20 md:pb-16 px-4 md:px-8 bg-[var(--campus-bg)]">
      <div className="max-w-[1600px] mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="mb-4 text-2xl md:text-4xl lg:text-5xl">
            Ready to Be a{" "}
            <span className="bg-gradient-to-r from-[#2D7FF9] to-[#9D4EDD] bg-clip-text text-transparent">
              Campus Hero?
            </span>
          </h1>
          <p className="text-[var(--campus-text-secondary)] text-base md:text-lg lg:text-xl">
            Accept quests, earn rewards, level up your campus life.
          </p>
        </div>

        {/* Filter Bar - Responsive */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-8">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-[var(--campus-card-bg)] backdrop-blur-md rounded-xl px-3 md:px-4 py-2 md:py-3 border border-[var(--campus-border)] cursor-pointer hover:bg-opacity-80 transition-colors text-sm md:text-base">
            <ArrowUpDown className="w-4 h-4 text-[var(--campus-text-secondary)]" />
            <span className="text-[var(--campus-text-primary)]">Sort by: Highest Pay</span>
          </div>

          {/* Filter Urgency */}
          <div className="flex items-center gap-2 bg-[var(--campus-card-bg)] backdrop-blur-md rounded-xl px-3 md:px-4 py-2 md:py-3 border border-[var(--campus-border)] cursor-pointer hover:bg-opacity-80 transition-colors text-sm md:text-base">
            <ListFilter className="w-4 h-4 text-[var(--campus-text-secondary)]" />
            <span className="text-[var(--campus-text-primary)]">Filter: Urgent</span>
          </div>

          {/* Filter Location */}
          <div className="flex items-center gap-2 bg-[var(--campus-card-bg)] backdrop-blur-md rounded-xl px-3 md:px-4 py-2 md:py-3 border border-[var(--campus-border)] cursor-pointer hover:bg-opacity-80 transition-colors text-sm md:text-base">
            <MapPin className="w-4 h-4 text-[var(--campus-text-secondary)]" />
            <span className="text-[var(--campus-text-primary)]">Location: Hostels</span>
          </div>

          {/* Stats */}
          <div className="ml-auto flex items-center gap-4 md:gap-6 text-sm md:text-base">
            <div className="text-center">
              <div className="text-[var(--campus-text-secondary)] text-xs md:text-sm">Available Quests</div>
              <div className="text-[var(--campus-text-primary)]">{quests.length}</div>
            </div>
            <div className="text-center">
              <div className="text-[var(--campus-text-secondary)] text-xs md:text-sm">Total Rewards</div>
              <div className="text-[#00F5D4]">
                ₹{quests.reduce((sum, q) => sum + q.reward, 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Quest Grid - Loading State */}
        {isLoading && <SkeletonLoader />}

        {/* Quest Grid - Empty State */}
        {showEmpty && !isLoading && (
          <EmptyState
            onRefresh={handleRefresh}
            onClearFilters={handleClearFilters}
          />
        )}

        {/* Quest Grid - Normal State - Responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
        {!isLoading && !showEmpty && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quests.map((quest, index) => (
              <QuestCard 
                key={index} 
                {...quest} 
                onAccept={() => handleAcceptQuest(quest, index)}
                isAccepted={acceptedQuestIds.has(quest.title)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <ToastNotification
        isVisible={showToast}
        title={acceptedQuest?.title || ""}
        location={acceptedQuest?.location}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}