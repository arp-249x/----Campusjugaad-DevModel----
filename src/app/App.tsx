import { useState, useEffect } from "react";
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
import { HelpCircle } from "lucide-react";

// --- TYPES ---
export interface Quest {
  _id?: string; // Added for Backend ID
  id?: string;  // Fallback
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
  status: "open" | "active" | "completed" | "expired"; 
  ratingGiven?: boolean;
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
  
  // --- APP STATE ---
  const [activeTab, setActiveTab] = useState("post");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]); // Quest Data
  
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showWalletOverlay, setShowWalletOverlay] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  
  const { showToast } = useToast();

  // --- DATA STORES ---
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activityLog, setActivityLog] = useState<Quest[]>([]); // Derived from quests now
  const [balance, setBalance] = useState(450);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // --- 1. INITIAL LOAD & WALLET SYNC ---
  
  // A. Load User from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("campus_jugaad_current_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // B. Sync Wallet with Backend (Handles Refunds/Rewards)
  const fetchCurrentUser = async () => {
    if(!currentUser) return;
    try {
        const res = await fetch(`http://localhost:5000/api/auth/me?username=${currentUser.username}`);
        if(res.ok) {
            const freshUser = await res.json();
            // Update Balance & XP, keep session
            setCurrentUser((prev: any) => ({ ...prev, balance: freshUser.balance, xp: freshUser.xp, rating: freshUser.rating }));
            setBalance(freshUser.balance);
            localStorage.setItem("campus_jugaad_current_user", JSON.stringify(freshUser));
        }
    } catch(err) { console.error("Sync failed"); }
  };

  // Sync every 5 seconds
  useEffect(() => {
    if(currentUser) {
        fetchCurrentUser();
        const interval = setInterval(fetchCurrentUser, 5000); 
        return () => clearInterval(interval);
    }
  }, [currentUser?.username]);


  // --- 2. QUEST DATA FETCHING ---
  const fetchQuests = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/quests');
      const data = await res.json();
      setQuests(data);
      
      // Update Activity Log for Dashboard
      if (currentUser) {
         const myHistory = data.filter((q: Quest) => 
            (q.postedBy === currentUser.username || q.assignedTo === currentUser.username) && 
            ['completed', 'expired'].includes(q.status)
         );
         setActivityLog(myHistory);
      }
    } catch (err) {
      console.error("Failed to load quests:", err);
    }
  };

  useEffect(() => {
    fetchQuests();
    const interval = setInterval(fetchQuests, 5000); // Poll for new quests
    return () => clearInterval(interval);
  }, [currentUser]);


  // --- 3. CHAT POLLING (Real Mode) ---
  useEffect(() => {
    let interval: any;
    if (chatMode === 'real' && chatQuestId) {
        const fetchMessages = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/quests/${chatQuestId}/messages`);
                const data = await res.json();
                setChatMessages(data.map((m: any) => ({
                    id: m._id,
                    text: m.text,
                    sender: m.sender === currentUser?.username ? 'user' : 'other',
                    timestamp: m.timestamp
                })));
            } catch (e) {}
        };
        fetchMessages();
        interval = setInterval(fetchMessages, 3000);
    }
    return () => clearInterval(interval);
  }, [chatMode, chatQuestId]);


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

  // --- API ACTIONS (The Brain) ---

  const addQuest = async (newQuestData: any) => {
    if (balance < newQuestData.reward) {
      showToast("error", "Insufficient Balance", "Add money to your wallet.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/quests', {
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
        fetchQuests(); // Refresh list
        setActiveTab("find");
      } else {
        showToast("error", "Error", data.message);
      }
    } catch (error) {
      showToast("error", "Network Error", "Is the backend running?");
    }
  };

  // 1. ADD THIS FUNCTION
const fetchTransactions = async () => {
  if (!currentUser) return;
  try {
    const res = await fetch(`http://localhost:5000/api/transactions?username=${currentUser.username}`);
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

// 2. UPDATE YOUR USE EFFECT to call it
useEffect(() => {
  if (currentUser) {
    fetchCurrentUser(); // Your existing user sync
    fetchTransactions(); // <--- ADD THIS LINE
    const interval = setInterval(() => {
        fetchCurrentUser();
        fetchTransactions(); // <--- ADD THIS LINE
    }, 5000);
    return () => clearInterval(interval);
  }
}, [currentUser?.username]);


  const handleAcceptQuest = async (quest: Quest) => {
  // ... existing checks ...
  try {
    const res = await fetch(`http://localhost:5000/api/quests/${quest._id}/accept`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroUsername: currentUser.username })
    });
    const data = await res.json();

    if (res.ok) {
      setActiveQuest(data.quest);
      
      // 👇 FORCE REAL CHAT MODE HERE
      setChatQuestId(data.quest._id);
      setChatMode('real'); 
      setChatMessages([]); // Clear any old AI messages
      setIsChatOpen(true);
      
      fetchQuests();
    }
    // ... error handling ...
  } catch (err) { /* ... */ }
};

  const handleCompleteQuest = async (otpInput: string) => {
    if (!activeQuest || !currentUser) return;

    try {
      const res = await fetch(`http://localhost:5000/api/quests/${activeQuest._id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpInput, heroUsername: currentUser.username })
      });

      const data = await res.json();

      if (res.ok) {
        const reward = activeQuest.reward;
        setBalance(prev => prev + reward);
        addTransaction("credit", `Reward: ${activeQuest.title}`, reward);
        
        // Update Local User XP
        setCurrentUser((prev: any) => ({ ...prev, xp: (prev.xp || 0) + activeQuest.xp }));
        
        addNotification("Quest Completed!", `You earned ₹${reward}!`, "success");
        showToast("success", "Quest Completed!", `₹${reward} added.`);
        
        setActiveQuest(null);
        setIsChatOpen(false);
        fetchQuests();
      } else {
        showToast("error", "Invalid OTP", "Ask the Task Master for the correct code.");
      }
    } catch (err) {
      showToast("error", "Error", "Connection failed");
    }
  };

  const handleDropQuest = async () => {
    if (!activeQuest || !currentUser) return;
    if (!confirm("Give up on this quest?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/quests/${activeQuest._id}/resign`, {
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
      const res = await fetch(`http://localhost:5000/api/quests/${questId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser.username })
      });

      if (res.ok) {
        fetchQuests();
        fetchCurrentUser(); // Get money back
        showToast("success", "Cancelled", "Quest deleted and money refunded.");
      }
    } catch (err) { console.error(err); }
  };

  const handleRateHero = async (questId: string, rating: number) => {
    try {
        await fetch(`http://localhost:5000/api/quests/${questId}/rate`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ rating })
        });
        fetchQuests();
        showToast("success", "Rated", "Feedback submitted!");
    } catch(err) { console.error(err); }
  };

  const handleSendMessage = async (text: string) => {
  // 👇 STRICT CHECK: If we have an active quest ID, it MUST be real chat
  if (chatMode === 'real' || (activeQuest && chatMode !== 'ai')) {
      const targetId = chatQuestId || activeQuest?._id;
      
      if (targetId) {
        await fetch(`http://localhost:5000/api/quests/${targetId}/messages`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ sender: currentUser.username, text })
        });
        // Optimistic Update
        setChatMessages(prev => [...prev, { text, sender: 'user', timestamp: new Date() }]);
      }
  } 
  // ONLY use AI if explicitly in AI mode
  else if (chatMode === 'ai') {
      setChatMessages(prev => [...prev, { text, sender: 'user', timestamp: new Date() }]);
      setTimeout(() => {
          setChatMessages(prev => [...prev, { text: "I am the Support Bot. For quest chats, please accept a quest!", sender: 'ai', timestamp: new Date() }]);
      }, 1000);
  }
};

  const handleWithdraw = (amount: number) => {
    // Mock Withdraw (Frontend only for now)
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      addTransaction("debit", "Withdrawal", amount);
      showToast("success", "Withdrawal Successful", `₹${amount} transferred.`);
    } else {
      showToast("error", "Insufficient Funds", "Not enough balance.");
    }
  };

  const handleAddMoney = (amount: number) => {
    // Mock Add Money
    setBalance(prev => prev + amount);
    addTransaction("credit", "Wallet Recharge", amount);
    showToast("success", "Money Added", `₹${amount} added.`);
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

        {activeTab === "post" && <TaskMasterView addQuest={addQuest} balance={balance} />}
        
        {activeTab === "find" && (
          <HeroView 
            // FILTER: Only Open Quests
            quests={quests.filter(q => q.status === "open")} 
            onAcceptQuest={handleAcceptQuest} 
            activeQuest={activeQuest} 
            currentUser={currentUser}
          />
        )}
        
        {activeTab === "dashboard" && (
            <DashboardView 
                currentUser={currentUser} 
                // Logic: Active quest I accepted OR Active quest I posted
                activeQuest={activeQuest || quests.find(q => q.postedBy === currentUser.username && q.status === 'active')}
                // Logic: My History (Posted or Done)
                activityLog={activityLog}
                // Logic: Quests I posted that are still OPEN
                postedQuests={quests.filter(q => q.postedBy === currentUser.username && q.status === 'open')}
                
                // PASS NEW HANDLERS
                onCancelQuest={handleCancelQuest}
                onRateHero={handleRateHero}
                onOpenChat={(quest: any) => {
                    setChatQuestId(quest._id);
                    setChatMode('real'); // <--- FORCE REAL MODE
                    setChatMessages([]);
                    setIsChatOpen(true);
                }}
            />
        )}
        
        {activeTab === "leaderboard" && <LeaderboardView currentUser={currentUser} />}

        <Footer />
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Support Bot Button */}
      <div className="fixed bottom-24 right-6 z-40 md:bottom-12">
        <button 
            onClick={() => { setChatMode('ai'); setChatMessages([]); setIsChatOpen(true); }}
            className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full shadow-lg hover:bg-white/20 transition-all text-[var(--campus-text-primary)]"
            title="Support Bot"
        >
            <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      {activeQuest && (
        <ActiveQuestBar 
          quest={activeQuest}
          onComplete={handleCompleteQuest}
          onDismiss={handleDropQuest} // Reuse dismiss for "Drop"
          isChatOpen={isChatOpen}
          onChatToggle={() => {
              setChatQuestId(activeQuest._id || activeQuest.id || null);
              setChatMode('real');
              setIsChatOpen(!isChatOpen);
          }}
        />
      )}

      {/* Reused Chat Interface */}
      <ChatInterface 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        title={chatMode === 'ai' ? "Campus Support Bot" : `Chat: ${activeQuest?.title || 'Quest'}`}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        // Legacy props for UI fallback
        questTitle={activeQuest?.title || ""}
        questLocation={activeQuest?.location || ""}
        questReward={activeQuest?.reward || 0}
        secretOTP={activeQuest?.otp || ""} 
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