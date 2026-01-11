import { Search, Filter, ArrowUpDown, Flame, MapPin, DollarSign, ListFilter } from "lucide-react";
import { QuestCard } from "./QuestCard";
import { useState, useMemo } from "react";
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
  postedBy?: string;
  id?: string;
  _id?: string;
  negotiable?: boolean;
}

interface HeroViewProps {
  quests: Quest[];
  onAcceptQuest?: (quest: Quest) => void;
  onPlaceBid?: (quest: Quest, amount: number) => void; 
  activeQuest: any | null;
  currentUser: any;
}

export function HeroView({ quests, onAcceptQuest, onPlaceBid, activeQuest, currentUser }: HeroViewProps) {
  const [showToast, setShowToast] = useState(false);
  const [acceptedQuest, setAcceptedQuest] = useState<Quest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'high-pay' | 'near-me'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'reward' | 'deadline'>('newest');

  const processedQuests = useMemo(() => {
    let result = [...quests];
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(q => 
        q.title.toLowerCase().includes(lowerQuery) || 
        q.description.toLowerCase().includes(lowerQuery) ||
        q.location?.toLowerCase().includes(lowerQuery)
      );
    }
    if (activeFilter === 'urgent') {
      result = result.filter(q => q.urgency === 'urgent');
    } else if (activeFilter === 'high-pay') {
      result = result.filter(q => q.reward >= 100); 
    } 
    if (sortBy === 'reward') {
      result.sort((a, b) => b.reward - a.reward); 
    } else if (sortBy === 'deadline') {
      result.sort((a, b) => new Date(a.deadlineIso || "").getTime() - new Date(b.deadlineIso || "").getTime()); 
    } 
    return result;
  }, [quests, searchQuery, activeFilter, sortBy]);

  // Handling Bids
  const handleAcceptQuest = (quest: Quest, amount?: number) => {
    if (activeQuest) {
        onAcceptQuest?.(quest);
        return;
    }
    
    // IF AMOUNT EXISTS, IT IS A BID
    if (amount !== undefined && onPlaceBid) {
        onPlaceBid(quest, amount);
        return;
    }

    // OTHERWISE, IT IS A NORMAL ACCEPT
    setAcceptedQuest(quest);
    setShowToast(true);
    onAcceptQuest?.(quest);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
        setSearchQuery("");
        setActiveFilter("all");
        setIsLoading(false);
    }, 1000);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveFilter("all");
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen pt-16 md:pt-28 pb-20 md:pb-16 px-4 md:px-8 bg-[var(--campus-bg)]">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-8">
          <h1 className="mb-2 text-3xl md:text-5xl font-bold">
            Find Your <span className="bg-gradient-to-r from-[#2D7FF9] to-[#9D4EDD] bg-clip-text text-transparent">Quest</span>
          </h1>
          <p className="text-[var(--campus-text-secondary)]">
            {processedQuests.length} tasks available for you today.
          </p>
        </div>

        <div className="sticky top-20 z-30 bg-[var(--campus-bg)]/95 backdrop-blur-md py-4 mb-6 -mx-4 px-4 border-b border-[var(--campus-border)] shadow-sm">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--campus-text-secondary)] group-focus-within:text-[#2D7FF9] transition-colors" />
              <input 
                type="text" 
                placeholder="Search tasks, locations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[var(--campus-card-bg)] border border-[var(--campus-border)] rounded-xl outline-none focus:border-[#2D7FF9] focus:ring-1 focus:ring-[#2D7FF9] transition-all"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  activeFilter === 'all' 
                    ? 'bg-[#2D7FF9] text-white border-[#2D7FF9]' 
                    : 'bg-transparent text-[var(--campus-text-secondary)] border-[var(--campus-border)] hover:border-[#2D7FF9]/50'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveFilter('high-pay')}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  activeFilter === 'high-pay' 
                    ? 'bg-green-500 text-white border-green-500' 
                    : 'bg-transparent text-[var(--campus-text-secondary)] border-[var(--campus-border)] hover:border-green-500/50'
                }`}
              >
                <DollarSign className="w-3 h-3" /> High Pay
              </button>
              <button 
                onClick={() => setActiveFilter('urgent')}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  activeFilter === 'urgent' 
                    ? 'bg-[#FF4800] text-white border-[#FF4800]' 
                    : 'bg-transparent text-[var(--campus-text-secondary)] border-[var(--campus-border)] hover:border-[#FF4800]/50'
                }`}
              >
                <Flame className="w-3 h-3" /> Urgent
              </button>
              <div className="w-px h-6 bg-[var(--campus-border)] mx-2"></div>
              <div className="relative">
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-transparent pl-2 pr-8 py-2 text-sm font-medium text-[var(--campus-text-primary)] outline-none cursor-pointer hover:text-[#2D7FF9]"
                >
                    <option value="newest" className="bg-[var(--campus-card-bg)] text-[var(--campus-text-primary)]">Newest First</option>
                    <option value="reward" className="bg-[var(--campus-card-bg)] text-[var(--campus-text-primary)]">Highest Pay</option>
                    <option value="deadline" className="bg-[var(--campus-card-bg)] text-[var(--campus-text-primary)]">Urgent Deadline</option>
                </select>
                <ArrowUpDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--campus-text-secondary)] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {isLoading && <SkeletonLoader />}

        {!isLoading && processedQuests.length === 0 && (
           <div className="py-20 text-center animate-in fade-in zoom-in duration-300">
             <EmptyState 
                onRefresh={handleRefresh} 
                onClearFilters={handleClearFilters} 
             />
             <p className="mt-4 text-[var(--campus-text-secondary)]">
                {searchQuery || activeFilter !== 'all' ? "No quests match your filters." : "No quests available right now."}
             </p>
           </div>
        )}

        {!isLoading && processedQuests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {processedQuests.map((quest, index) => {
              const isOwner = currentUser?.username === quest.postedBy;
              
              return (
                <div key={index} className="relative group">
                  <QuestCard 
                    {...quest} 
                    onAccept={(amount?: number) => handleAcceptQuest(quest, amount)}
                    isAccepted={activeQuest?.title === quest.title}
                    isMyQuest={isOwner}
                    currentUser={currentUser} 
                  />
                </div>
              );
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
