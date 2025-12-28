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
  deadlineIso?: string;
  location?: string;
  highlighted?: boolean;
  isMyQuest?: boolean;
  otp: string;
  postedBy?: string; // <--- ADDED: We need this to check ownership
}

interface HeroViewProps {
  quests: Quest[];
  onAcceptQuest?: (quest: Quest) => void;
  activeQuest: any | null;
  currentUser: any; // <--- ADDED: Pass the logged-in user here
}

export function HeroView({ quests, onAcceptQuest, activeQuest, currentUser }: HeroViewProps) { // <--- ADDED currentUser destructuring
  const [showToast, setShowToast] = useState(false);
  const [acceptedQuest, setAcceptedQuest] = useState<Quest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  const handleAcceptQuest = (quest: Quest) => {
    if (activeQuest) {
        onAcceptQuest?.(quest);
        return;
    }
    setAcceptedQuest(quest);
    setShowToast(true);
    onAcceptQuest?.(quest);
  };

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
        
        {/* ... (Header and Filter Bar code remains exactly the same) ... */}
        {/* Just keep the Header and Filter Bar sections unchanged */}
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
        
        {/* ... (Filter Bar code hidden for brevity, keep it as is) ... */}

        {isLoading && <SkeletonLoader />}

        {showEmpty && !isLoading && (
          <EmptyState
            onRefresh={handleRefresh}
            onClearFilters={handleClearFilters}
          />
        )}

        {!isLoading && !showEmpty && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quests.map((quest, index) => {
              // --- LOGIC FIX STARTS HERE ---
              // Check if the current user is the one who posted this quest
              const isOwner = currentUser?.username === quest.postedBy;
              
              return (
                <div key={index} className="relative group">
                  <QuestCard 
                    {...quest} 
                    onAccept={() => handleAcceptQuest(quest)}
                    isAccepted={activeQuest?.title === quest.title}
                    isMyQuest={isOwner} // <--- PASS THE CHECK HERE
                  />
                </div>
              );
              // --- LOGIC FIX ENDS HERE ---
            })}
          </div>
        )}
      </div>

      <ToastNotification
        isVisible={showToast}
        title={acceptedQuest?.title || ""}
        location={acceptedQuest?.location}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}