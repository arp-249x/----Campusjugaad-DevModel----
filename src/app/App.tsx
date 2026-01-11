import { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "./components/ThemeContext";
import { ToastProvider, useToast } from "./components/ToastContext";
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
import { Footer } from "./components/Footer";
import { ChatInterface } from "./components/ChatInterface";
import { AuthPage } from "./components/AuthPage";
import { HelpCircle, Loader2 } from "lucide-react"; 
import { DisputeModal } from "./components/DisputeModal";
import { AdminDashboard } from "./components/AdminDashboard";

// --- TYPES ---
export interface Quest {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  reward: number;
  xp: number;
  urgency: "low" | "medium" | "urgent";
  deadline: string;
  deadlineIso: string;
  location?: string;
  highlighted?: boolean;
  isMyQuest?: boolean;
  otp: string;
  postedBy?: string;
  assignedTo?: string;
  status: "open" | "active" | "completed" | "expired" | "disputed" | "resolved"; 
  ratingGiven?: boolean;
  bids?: any[];
}

export interface Transaction {
  id: string;
  type: "credit" | "debit";
  description: string;
  amount: number;
  status: "success" | "pending" | "failed";
  date: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning";
  read: boolean;
}

function AppContent() {
  // --- AUTH & USER STATE ---
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // --- CHAT STATE ---
  const [chatMode, setChatMode] = useState<'none' | 'ai' | 'real'>('none');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatQuestId, setChatQuestId] = useState<string | null>(null);
  
  const [hasUnread, setHasUnread] = useState(false);
  const previousQuestsRef = useRef<Record<string, string>>({}); 
  const previousBidCountsRef = useRef<Record<string, number>>({});
  const lastMessageCountRef = useRef(0);

  // Ref to track initial load
  const isFirstLoadRef = useRef(true);
  
  // --- APP STATE ---
  const [activeTab, setActiveTab] = useState("post");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]); 
  
  // Loading State for Actions
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showWalletOverlay, setShowWalletOverlay] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  
  const { showToast } = useToast();

  // --- DATA STORES ---
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activityLog, setActivityLog] = useState<Quest[]>([]);
  const [balance, setBalance] = useState(450);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Dispute State
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [questToDispute, setQuestToDispute] = useState<Quest | null>(null);

  // 1. Load Notifications
  useEffect(() => {
    const savedNotifs = localStorage.getItem("campus_notifications");
    if (savedNotifs) {
        setNotifications(JSON.parse(savedNotifs));
    }
  }, []);

  // 2. Save Notifications
  useEffect(() => {
    localStorage.setItem("campus_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const savedUser = localStorage.getItem("campus_jugaad_current_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const fetchCurrentUser = async () => {
    if(!currentUser) return;
    try {
        const res = await fetch(`/api/auth/me?username=${currentUser.username}`);
        if(res.ok) {
            const freshUser = await res.json();
            setCurrentUser((prev: any) => ({ ...prev, balance: freshUser.balance, xp: freshUser.xp, rating: freshUser.rating }));
            setBalance(freshUser.balance);
            localStorage.setItem("campus_jugaad_current_user", JSON.stringify(freshUser));
        }
    } catch(err) { console.error("Sync failed"); }
  };

  const handleDispute = (quest: any) => {
    setQuestToDispute(quest);
    setIsDisputeModalOpen(true);
  };

  const submitDispute = async (reason: string) => {
    if (!questToDispute) return;
    try {
      const res = await fetch(`/api/disputes/${questToDispute._id}/raise`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: currentUser.username, reason })
      });
      if (res.ok) {
        showToast("success", "Dispute Raised", "Admins have been notified.");
        fetchQuests(); // Refresh to see status change
      }
    } catch (err) { console.error(err); }
  };

  const fetchTransactions = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/transactions?username=${currentUser.username}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.map((t: any) => ({
          id: t._id,
          type: t.type,
          description: t.description,
          amount: t.amount,
          status: t.status,
          date: new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      }
    } catch (e) { console.error("Txn fetch error", e); }
  };

  const fetchQuests = async () => {
    try {
      const url = currentUser 
      ? `/api/quests?username=${currentUser.username}` 
      : '/api/quests';
      
      const res = await fetch(url);
      const data = await res.json();
      setQuests(data);
      
      if (currentUser) {
          // Skip notifications on first load
          if (!isFirstLoadRef.current) {
            data.forEach((q: Quest) => {
                if (q.postedBy === currentUser.username) {
                    const questId = q._id || '';
                    
                    // 1. Check for Status Change
                    const prevStatus = previousQuestsRef.current[questId];
                    if (prevStatus === 'open' && q.status === 'active') {
                        addNotification("Quest Accepted!", `Hero @${q.assignedTo} picked up "${q.title}"`, "success");
                        showToast("success", "Quest Accepted", `Hero @${q.assignedTo} is on it!`);
                    }

                    // 2. Check for NEW BIDS (Only if quest is OPEN)
                    if (q.status === 'open') {
                        const prevBidCount = previousBidCountsRef.current[questId] || 0;
                        const currentBidCount = q.bids ? q.bids.length : 0;

                        if (currentBidCount > prevBidCount) {
                            const newBid = q.bids![q.bids!.length - 1];
                            const uniqueBidders = Array.from(new Set(q.bids!.map((b: any) => b.heroUsername)));
                            const heroAlias = `Hero ${uniqueBidders.indexOf(newBid.heroUsername) + 1}`;

                            addNotification("New Bid Received", `${heroAlias} offered ₹${newBid.amount} for "${q.title}"`);
                            showToast("info", "New Bid!", `${heroAlias}: ₹${newBid.amount}`);
                        }
                    }
                }
            });
          }

          // Update Refs
          const newStatusMap: any = {};
          const newBidMap: any = {};
          data.forEach((q: Quest) => {
              const qId = q._id || '';
              newStatusMap[qId] = q.status;
              newBidMap[qId] = q.bids ? q.bids.length : 0;
          });
          previousQuestsRef.current = newStatusMap;
          previousBidCountsRef.current = newBidMap;

          // Mark first load as complete
          isFirstLoadRef.current = false;
      }
      
      // Update Active Quest & History
      if (currentUser) {
         
         // Disputed quests should NOT block this slot.
         const ongoingQuest = data.find((q: Quest) => 
            (q.assignedTo === currentUser.username || q.postedBy === currentUser.username) && 
            q.status === 'active' 
         );
         
         if (ongoingQuest) {
            setActiveQuest(ongoingQuest);
            setChatQuestId(ongoingQuest._id || ongoingQuest.id);
         } else {
            setActiveQuest(null);
         }
         
         // History includes completed, expired, disputed, and resolved.
         const myHistory = data.filter((q: Quest) => 
            (q.postedBy === currentUser.username || q.assignedTo === currentUser.username) && 
            ['completed', 'expired', 'disputed', 'resolved'].includes(q.status)
         );
         setActivityLog(myHistory);
      }
    } catch (err) { console.error(err); }
  };

  // Main Sync Loop
  useEffect(() => {
    if (currentUser) {
        // Reset first load flag on user change
        isFirstLoadRef.current = true;
        fetchCurrentUser();
        fetchTransactions();
        fetchQuests();
        
        const interval = setInterval(() => {
            fetchCurrentUser();
            fetchTransactions();
            fetchQuests();
        }, 5000);
        return () => clearInterval(interval);
    }
  }, [currentUser?.username]);

  // --- CHAT POLLING ---
  useEffect(() => {
    let interval: any;
    
    // Find ANY active quest
    const currentActiveQuest = quests.find(q => 
        (q.assignedTo === currentUser?.username || q.postedBy === currentUser?.username) 
        && q.status === 'active'
    );
    
    const targetId = chatQuestId || currentActiveQuest?._id;

    if (currentUser && targetId) {
        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/quests/${targetId}/messages`);
                if (res.ok) {
                    const data = await res.json();
                    
                    if (data.length > lastMessageCountRef.current) {
                        const lastMsg = data[data.length - 1];
                        
                        if (lastMsg.sender !== currentUser.username && !isChatOpen) {
                            let senderAlias = "Quest Partner";
                            if (currentActiveQuest) {
                                if (currentActiveQuest.postedBy === currentUser.username) {
                                    senderAlias = "Hero";
                                } else if (currentActiveQuest.assignedTo === currentUser.username) {
                                    senderAlias = "Task Master";
                                }
                            }

                            setHasUnread(true); 
                            showToast("info", "New Message", `Message from ${senderAlias}`);
                        }
                    }
                    
                    if (isChatOpen) {
                        setHasUnread(false);
                    }

                    lastMessageCountRef.current = data.length;

                    setChatMessages(data.map((m: any) => ({
                        id: m._id,
                        text: m.text,
                        sender: m.sender === currentUser?.username ? 'user' : 'other',
                        timestamp: m.timestamp
                    })));
                }
            } catch (e) { console.error("Polling error", e); }
        };
        
        fetchMessages();
        interval = setInterval(fetchMessages, 3000);
    }
    return () => clearInterval(interval);
  }, [chatQuestId, currentUser, quests, isChatOpen]);

  // --- ACTIONS ---

  const addNotification = (title: string, message: string, type: "info" | "success" | "warning" = "info") => {
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title,
      message,
      time: "Just now",
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addTransaction = (type: "credit" | "debit", description: string, amount: number) => {
    const newTxn: Transaction = {
      id: `TXN-${Math.floor(Math.random() * 10000)}`,
      type,
      description,
      amount,
      status: "success",
      date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    };
    setTransactions(prev => [newTxn, ...prev]);
  };

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setBalance(user.balance);
    localStorage.setItem("campus_jugaad_current_user", JSON.stringify(user));
    showToast("success", `Welcome, ${user.name.split(' ')[0]}!`, "Let's get some tasks done.");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("campus_jugaad_current_user");
    setActiveTab("post");
    setActiveQuest(null);
    setIsChatOpen(false);
  };

  // --- API ACTIONS ---

  const addQuest = async (newQuestData: any) => {
    if (isSubmitting) return;

    if (balance < newQuestData.reward) {
      showToast("error", "Insufficient Balance", "Add money to your wallet.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newQuestData,
          postedBy: currentUser.username
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setBalance(prev => prev - newQuestData.reward); 
        addTransaction("debit", `Escrow: ${data.title}`, newQuestData.reward);
        addNotification("Quest Posted", `"${data.title}" is live!`);
        fetchQuests();
        setActiveTab("find");
      } else {
        showToast("error", "Error", data.message);
      }
    } catch (error) {
      showToast("error", "Network Error", "Is the backend running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlaceBid = async (quest: Quest, bidAmount: number) => {
    if (!currentUser || isSubmitting) return;
    
    if (currentUser.username === 'guest') {
        showToast("error", "Access Denied", "Please sign up to place bids!");
        return;
    }
    
    setIsSubmitting(true);
    try {
        const res = await fetch(`/api/quests/${quest._id}/bid`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                heroUsername: currentUser.username, 
                amount: bidAmount 
            })
        });
        
        if (res.ok) {
            showToast("success", "Bid Placed!", `You offered ₹${bidAmount} for "${quest.title}"`);
            fetchQuests();
        } else {
            const err = await res.json();
            showToast("error", "Error", err.message);
        }
    } catch (e) { console.error(e); }
    finally { setIsSubmitting(false); }
  };

  const handleAcceptQuest = async (quest: Quest) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/quests/${quest._id}/accept`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ heroUsername: currentUser.username })
      });
      const data = await res.json();
      if (res.ok) {
        setActiveQuest(data.quest);
        setChatQuestId(data.quest._id);
        setChatMode('real'); 
        setChatMessages([]);
        setIsChatOpen(true);
        fetchQuests();
      } else {
        showToast("error", "Oops!", data.message || "Quest unavailable.");
        fetchQuests(); 
      }
    } catch (err) { /* ... */ }
    finally { setIsSubmitting(false); }
  };

  const handleCompleteQuest = async (otpInput: string) => {
    if (!activeQuest || !currentUser || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/quests/${activeQuest._id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpInput, heroUsername: currentUser.username })
      });
      if (res.ok) {
        const reward = activeQuest.reward;
        setBalance(prev => prev + reward);
        addTransaction("credit", `Reward: ${activeQuest.title}`, reward);
        setCurrentUser((prev: any) => ({ ...prev, xp: (prev.xp || 0) + activeQuest.xp }));
        addNotification("Quest Completed!", `You earned ₹${reward}!`, "success");
        showToast("success", "Quest Completed!", `₹${reward} added.`);
        setActiveQuest(null);
        setIsChatOpen(false);
        fetchQuests();
      } else {
        showToast("error", "Invalid OTP", "Ask the Task Master for the correct code.");
      }
    } catch (err) { showToast("error", "Error", "Connection failed"); }
    finally { setIsSubmitting(false); }
  };

  const handleDropQuest = async () => {
    if (!activeQuest || !currentUser) return;
    if (!confirm("Give up on this quest?")) return;
    try {
      const res = await fetch(`/api/quests/${activeQuest._id}/resign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroUsername: currentUser.username })
      });
      if (res.ok) {
        setActiveQuest(null);
        fetchQuests();
        showToast("info", "Quest Dropped", "You resigned from the quest.");
      }
    } catch (err) { console.error(err); }
  };

  const handleCancelQuest = async (questId: string) => {
    if (!confirm("Delete this quest? Funds will be refunded.")) return;
    try {
      const res = await fetch(`/api/quests/${questId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser.username })
      });
      if (res.ok) {
        fetchQuests();
        fetchCurrentUser();
        showToast("success", "Cancelled", "Quest deleted and money refunded.");
      }
    } catch (err) { console.error(err); }
  };

  const handleRateHero = async (questId: string, rating: number) => {
    try {
        await fetch(`/api/quests/${questId}/rate`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ rating })
        });
        fetchQuests();
        showToast("success", "Rated", "Feedback submitted!");
    } catch(err) { console.error(err); }
  };

  const handleSendMessage = async (text: string) => {
    if (chatMode === 'real' || (activeQuest && chatMode !== 'ai')) {
        const targetId = chatQuestId || activeQuest?._id;
        if (targetId) {
          try {
            const response = await fetch(`/api/quests/${targetId}/messages`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ sender: currentUser.username, text })
            });
            if (response.ok) {
                const savedMessage = await response.json();
                setChatMessages(prev => [...prev, { 
                    id: savedMessage._id, 
                    text: savedMessage.text, 
                    sender: 'user', 
                    timestamp: savedMessage.timestamp 
                }]);
            }
          } catch(err) { console.error("Failed to send", err); }
        }
    } else if (chatMode === 'ai') {
        setChatMessages(prev => [...prev, { text, sender: 'user', timestamp: new Date() }]);
        setTimeout(() => {
            setChatMessages(prev => [...prev, { text: "I am the Support Bot. For quest chats, please accept a quest!", sender: 'ai', timestamp: new Date() }]);
        }, 1000);
    }
  };

  const handleWithdraw = async (amount: number) => {
    try {
        const res = await fetch('/api/transactions/withdraw', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username: currentUser.username, amount })
        });
        if (res.ok) {
            const data = await res.json();
            setBalance(data.balance); 
            fetchTransactions();
            showToast("success", "Withdrawal Successful", `₹${amount} transferred.`);
        } else {
            showToast("error", "Withdrawal Failed", "Insufficient funds or server error.");
        }
    } catch (e) { console.error(e); }
  };

  const handleAddMoney = async (amount: number) => {
    try {
        const res = await fetch('/api/transactions/add', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username: currentUser.username, amount })
        });
        if (res.ok) {
            const data = await res.json();
            setBalance(data.balance); 
            fetchTransactions();
            showToast("success", "Money Added", `₹${amount} added.`);
            addNotification("Wallet Update", `Recharged wallet with ₹${amount}`, "success");
        }
    } catch (e) { console.error(e); }
  };

  // --- RENDER ---
  if (!currentUser) return <AuthPage onLogin={handleLogin} onGuest={() => handleLogin({ name: "Guest", username: "guest", balance: 500 })} />;

  return (
    <div className="min-h-screen bg-[var(--campus-bg)] relative overflow-x-hidden transition-colors duration-300">
      {/* Background Glow */}
      <div className="dark:block hidden fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2D7FF9]/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#9D4EDD]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          onMenuClick={() => setShowMobileMenu(true)}
          onWalletClick={() => setShowWalletOverlay(true)}
          onNotificationClick={() => setShowNotificationPanel(true)}
          balance={balance}
          user={currentUser}
          onLogout={handleLogout}
          notificationCount={notifications.filter(n => !n.read).length}
        />
        
        <MobileTopBar 
          onMenuClick={() => setShowMobileMenu(true)}
          onWalletClick={() => setShowWalletOverlay(true)}
          onNotificationClick={() => setShowNotificationPanel(true)}
          balance={balance}
          user={currentUser}
        />

        {activeTab === "admin" && currentUser?.isAdmin && <AdminDashboard currentUser={currentUser} />}

        {activeTab === "post" && <TaskMasterView addQuest={addQuest} balance={balance} />}
        
        {activeTab === "find" && (
          <HeroView 
            quests={quests.filter(q => q.status === "open")} 
            onAcceptQuest={handleAcceptQuest} 
            onPlaceBid={handlePlaceBid} 
            activeQuest={activeQuest} 
            currentUser={currentUser}
          />
        )}
        
        {activeTab === "dashboard" && (
            <DashboardView 
              currentUser={currentUser} 
              hasUnread={hasUnread} 
              activeQuest={
                activeQuest || 
                quests.find(q => 
                  (q.postedBy === currentUser.username || q.assignedTo === currentUser.username) 
                  && q.status === 'active'
                )
              }
              activityLog={activityLog}
              postedQuests={quests.filter(q => q.postedBy === currentUser.username && ['open', 'active', 'completed', 'disputed', 'resolved'].includes(q.status))}
              onCancelQuest={handleCancelQuest}
              onRateHero={handleRateHero}
              onDispute={handleDispute}
              onOpenChat={(quest: any) => {
                  setChatQuestId(quest._id);
                  setChatMode('real'); 
                  setHasUnread(false);
                  setChatMessages([]);
                  setIsChatOpen(true);
              }}
            />
        )}
        
        {activeTab === "leaderboard" && <LeaderboardView currentUser={currentUser} />}

        <Footer />
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Floating Chat Button - ONLY shows if there is an active quest */}
      {(() => {
          const activeConversation = quests.find(q => 
              (q.assignedTo === currentUser?.username || q.postedBy === currentUser?.username) 
              && q.status === 'active'
          );

          if (!activeConversation) return null; // Hide button if no active quest

          return (
            <div className="fixed bottom-24 right-6 z-40 md:bottom-12">
                <button 
                    onClick={() => { 
                        setChatQuestId(activeConversation._id || activeConversation.id || null);
                        setChatMode('real');
                        setHasUnread(false);
                        setIsChatOpen(true);
                    }}
                    className={`relative bg-[#2D7FF9] text-white border border-white/20 p-3 rounded-full shadow-lg hover:bg-[#2D7FF9]/80 transition-all group ${hasUnread ? 'animate-bounce' : ''}`}
                    title="Open Chat"
                >
                    <HelpCircle className="w-6 h-6" />
                    {hasUnread && (
                        <span className="absolute top-0 right-0 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-[#2D7FF9]"></span>
                        </span>
                    )}
                </button>
            </div>
          );
      })()}

      {activeQuest && (
        <ActiveQuestBar 
            quest={activeQuest}
            onComplete={handleCompleteQuest}
            onDismiss={handleDropQuest} 
            onDispute={handleDispute}
            isChatOpen={isChatOpen}
            hasUnread={hasUnread}
            onChatToggle={() => {
                setChatQuestId(activeQuest._id || activeQuest.id || null);
                setChatMode('real');
                setHasUnread(false);
                setIsChatOpen(!isChatOpen);
            }}
            currentUser={currentUser}
        />
      )}
      
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl flex items-center space-x-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-700 dark:text-gray-200 font-medium">Processing...</span>
            </div>
        </div>
      )}

      <ChatInterface 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        title={chatMode === 'ai' ? "Campus Support Bot" : `Chat: ${activeQuest?.title || 'Quest'}`}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        questTitle={activeQuest?.title || ""}
        questLocation={activeQuest?.location || ""}
        questReward={activeQuest?.reward || 0}
        secretOTP={(currentUser?.username === activeQuest?.postedBy) ? (activeQuest?.otp || "") : ""} 
      />

      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={currentUser}
        onLogout={handleLogout}
      />

      <WalletOverlay
        isOpen={showWalletOverlay}
        onClose={() => setShowWalletOverlay(false)}
        balance={balance}
        transactions={transactions}
        onWithdraw={handleWithdraw}
        onAddMoney={handleAddMoney}
      />

      <DisputeModal 
        isOpen={isDisputeModalOpen} 
        onClose={() => setIsDisputeModalOpen(false)} 
        onSubmit={submitDispute}
        questTitle={questToDispute?.title || ""}
      />

      <NotificationPanel
        isOpen={showNotificationPanel}
        onClose={() => setShowNotificationPanel(false)}
        notifications={notifications}
        onClear={() => setNotifications([])}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}
