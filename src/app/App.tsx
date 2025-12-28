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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatMode, setChatMode] = useState<'none' | 'ai' | 'real'>('none');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatQuestId, setChatQuestId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("post");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showWalletOverlay, setShowWalletOverlay] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activityLog, setActivityLog] = useState<Quest[]>([]);
  const [balance, setBalance] = useState(450);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("campus_jugaad_current_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // --- API HELPER ---
  // If you are running locally, you might need localhost, but for Vercel it MUST be relative.
  // The setup below works for both if you have proxy setup in vite.config.ts for dev.
  const API_BASE = ""; 

  // --- SYNC DATA ---
  const fetchCurrentUser = async () => {
    if(!currentUser) return;
    try {
        // CHANGED: Removed http://localhost:5000
        const res = await fetch(`${API_BASE}/api/auth/me?username=${currentUser.username}`);
        if(res.ok) {
            const freshUser = await res.json();
            setCurrentUser((prev: any) => ({ ...prev, balance: freshUser.balance, xp: freshUser.xp, rating: freshUser.rating }));
            setBalance(freshUser.balance);
            localStorage.setItem("campus_jugaad_current_user", JSON.stringify(freshUser));
        }
    } catch(err) { console.error("Sync failed"); }
  };

  const fetchTransactions = async () => {
    if (!currentUser) return;
    try {
      // CHANGED: Removed http://localhost:5000
      const res = await fetch(`${API_BASE}/api/transactions?username=${currentUser.username}`);
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
      // CHANGED: Removed http://localhost:5000
      const res = await fetch(`${API_BASE}/api/quests`);
      const data = await res.json();
      setQuests(data);
      
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

  // --- POLLING ---
  useEffect(() => {
    if (currentUser) {
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
    if (chatMode === 'real' && chatQuestId) {
        const fetchMessages = async () => {
            try {
                // CHANGED: Removed http://localhost:5000
                const res = await fetch(`${API_BASE}/api/quests/${chatQuestId}/messages`);
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

  const addQuest = async (newQuestData: any) => {
    if (balance < newQuestData.reward) {
      showToast("error", "Insufficient Balance", "Add money to your wallet.");
      return;
    }

    try {
      // CHANGED: Removed http://localhost:5000
      const response = await fetch(`${API_BASE}/api/quests`, {
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
        // Note: fetchTransactions will sync the real balance shortly
        addNotification("Quest Posted", `"${data.title}" is live!`);
        fetchQuests();
        fetchTransactions();
        setActiveTab("find");
      } else {
        showToast("error", "Error", data.message);
      }
    } catch (error) {
      showToast("error", "Network Error", "Is the backend connected?");
    }
  };

  const handleAcceptQuest = async (quest: Quest) => {
    try {
      // CHANGED: Removed http://localhost:5000
      const res = await fetch(`${API_BASE}/api/quests/${quest._id}/accept`, {
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
      }
    } catch (err) { console.error(err); }
  };

  const handleCompleteQuest = async (otpInput: string) => {
    if (!activeQuest || !currentUser) return;
    try {
      // CHANGED: Removed http://localhost:5000
      const res = await fetch(`${API_BASE}/api/quests/${activeQuest._id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpInput, heroUsername: currentUser.username })
      });

      if (res.ok) {
        const reward = activeQuest.reward;
        setBalance(prev => prev + reward);
        setCurrentUser((prev: any) => ({ ...prev, xp: (prev.xp || 0) + activeQuest.xp }));
        
        addNotification("Quest Completed!", `You earned ₹${reward}!`, "success");
        showToast("success", "Quest Completed!", `₹${reward} added.`);
        
        setActiveQuest(null);
        setIsChatOpen(false);
        fetchQuests();
        fetchTransactions(); // Sync wallet
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
      // CHANGED: Removed http://localhost:5000
      const res = await fetch(`${API_BASE}/api/quests/${activeQuest._id}/resign`, {
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
      // CHANGED: Removed http://localhost:5000
      const res = await fetch(`${API_BASE}/api/quests/${questId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser.username })
      });

      if (res.ok) {
        fetchQuests();
        fetchTransactions();
        fetchCurrentUser(); 
        showToast("success", "Cancelled", "Quest deleted and money refunded.");
      }
    } catch (err) { console.error(err); }
  };

  const handleRateHero = async (questId: string, rating: number) => {
    try {
        // CHANGED: Removed http://localhost:5000
        await fetch(`${API_BASE}/api/quests/${questId}/rate`, {
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
          // CHANGED: Removed http://localhost:5000
          await fetch(`${API_BASE}/api/quests/${targetId}/messages`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ sender: currentUser.username, text })
          });
          setChatMessages(prev => [...prev, { text, sender: 'user', timestamp: new Date() }]);
        }
    } else if (chatMode === 'ai') {
        setChatMessages(prev => [...prev, { text, sender: 'user', timestamp: new Date() }]);
        setTimeout(() => {
            setChatMessages(prev => [...prev, { text: "I am the Support Bot. For quest chats, please accept a quest!", sender: 'ai', timestamp: new Date() }]);
        }, 1000);
    }
  };

  // Mock Withdraw/Add Money (These remain local mocks for now as per previous code)
  const handleWithdraw = (amount: number) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      showToast("success", "Withdrawal Successful", `₹${amount} transferred.`);
    } else {
      showToast("error", "Insufficient Funds", "Not enough balance.");
    }
  };

  const handleAddMoney = (amount: number) => {
    setBalance(prev => prev + amount);
    showToast("success", "Money Added", `₹${amount} added.`);
  };

  if (!currentUser) return <AuthPage onLogin={handleLogin} onGuest={() => handleLogin({ name: "Guest", username: "guest", balance: 500 })} />;

  return (
    <div className="min-h-screen bg-[var(--campus-bg)] relative overflow-x-hidden transition-colors duration-300">
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
            quests={quests.filter(q => q.status === "open")} 
            onAcceptQuest={handleAcceptQuest} 
            activeQuest={activeQuest} 
            currentUser={currentUser}
          />
        )}
        
        {activeTab === "dashboard" && (
            <DashboardView 
                currentUser={currentUser} 
                activeQuest={activeQuest || quests.find(q => q.postedBy === currentUser.username && q.status === 'active')}
                activityLog={activityLog}
                postedQuests={quests.filter(q => q.postedBy === currentUser.username && q.status === 'open')}
                onCancelQuest={handleCancelQuest}
                onRateHero={handleRateHero}
                onOpenChat={(quest: any) => {
                    setChatQuestId(quest._id);
                    setChatMode('real'); 
                    setChatMessages([]);
                    setIsChatOpen(true);
                }}
            />
        )}
        
        {activeTab === "leaderboard" && <LeaderboardView currentUser={currentUser} />}

        <Footer />
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

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
          onDismiss={handleDropQuest} 
          isChatOpen={isChatOpen}
          onChatToggle={() => {
              setChatQuestId(activeQuest._id || activeQuest.id || null);
              setChatMode('real');
              setIsChatOpen(!isChatOpen);
          }}
        />
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
