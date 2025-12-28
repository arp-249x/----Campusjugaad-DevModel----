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

export interface Quest {
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
  status?: "open" | "completed"; // New Status Field
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
  
  // --- APP STATE ---
  const [activeTab, setActiveTab] = useState("post");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showWalletOverlay, setShowWalletOverlay] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const { showToast } = useToast();

  // --- DATA STORES ---
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activityLog, setActivityLog] = useState<Quest[]>([]);
  const [balance, setBalance] = useState(450);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // 1. Initial Load of User (On Mount Only)
  useEffect(() => {
    const savedUser = localStorage.getItem("campus_jugaad_current_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // 2. Load USER-SPECIFIC Data
  useEffect(() => {
    if (!currentUser) return;

    const username = currentUser.username;

    const savedLog = localStorage.getItem(`campus_jugaad_activity_${username}`);
    setActivityLog(savedLog ? JSON.parse(savedLog) : []);

    const savedBalance = localStorage.getItem(`campus_jugaad_balance_${username}`);
    setBalance(savedBalance ? parseFloat(savedBalance) : 450);

    const savedTxns = localStorage.getItem(`campus_jugaad_transactions_${username}`);
    if (savedTxns) {
      setTransactions(JSON.parse(savedTxns));
    } else {
      setTransactions([{
        id: "TXN-INIT",
        type: "credit",
        description: "Welcome Bonus",
        amount: 50,
        status: "success",
        date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    }

    const savedActive = localStorage.getItem(`campus_jugaad_active_${username}`);
    setActiveQuest(savedActive ? JSON.parse(savedActive) : null);
    if(savedActive) setIsChatOpen(true);

  }, [currentUser?.username]);

  // 3. Persistence Wrappers
  useEffect(() => {
    if (currentUser) {
        localStorage.setItem(`campus_jugaad_activity_${currentUser.username}`, JSON.stringify(activityLog));
    }
  }, [activityLog, currentUser]);

  useEffect(() => {
    if (currentUser) {
        localStorage.setItem(`campus_jugaad_balance_${currentUser.username}`, balance.toString());
    }
  }, [balance, currentUser]);

  useEffect(() => {
    if (currentUser) {
        localStorage.setItem(`campus_jugaad_transactions_${currentUser.username}`, JSON.stringify(transactions));
    }
  }, [transactions, currentUser]);

  useEffect(() => {
    if (currentUser) {
        if (activeQuest) {
            localStorage.setItem(`campus_jugaad_active_${currentUser.username}`, JSON.stringify(activeQuest));
        } else {
            localStorage.removeItem(`campus_jugaad_active_${currentUser.username}`);
        }
    }
  }, [activeQuest, currentUser]);


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
    const userWithXp = { ...user, xp: user.xp || 0 };
    setCurrentUser(userWithXp);
    localStorage.setItem("campus_jugaad_current_user", JSON.stringify(userWithXp));
    showToast("success", `Welcome, ${user.name.split(' ')[0]}!`, "Let's get some tasks done.");
  };

  const handleGuestLogin = () => {
    const guestUser = { 
      name: "Guest Student", 
      email: "guest@campus.edu", 
      username: "GuestHero",
      id: "guest-123",
      xp: 0 
    };
    handleLogin(guestUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("campus_jugaad_current_user");
    setActiveTab("post");
    setActiveQuest(null);
    setActivityLog([]); 
    setTransactions([]);
    setIsChatOpen(false);
  };

  // --- QUEST DATA ---
  const generateDynamicQuests = (): Quest[] => {
    const now = new Date();
    const formatDisplay = (addMinutes: number) => {
      const d = new Date(now.getTime() + addMinutes * 60000);
      return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    };
    const getIso = (addMinutes: number) => new Date(now.getTime() + addMinutes * 60000).toISOString();

    return [
      {
        title: "Hold Canteen Line Spot",
        description: "Stand in the lunch queue for me for 20 mins.",
        reward: 40,
        xp: 20,
        urgency: "medium",
        deadline: formatDisplay(120),
        deadlineIso: getIso(120),
        location: "Main Canteen",
        otp: "0000", // Placeholder
        postedBy: "RahulS",
        status: "open"
      },
      {
        title: "Deliver Lab Coat ASAP",
        description: "Forgot my coat at Hostel 4. Need it at Chem Lab now!",
        reward: 80,
        xp: 40,
        urgency: "urgent",
        deadline: "In 30 Mins", 
        deadlineIso: getIso(30),
        location: "Hostel 4 → Chem Lab",
        otp: "0000",
        postedBy: "PriyaP",
        status: "open"
      },
      {
        title: "Tutoring Session: Calculus II",
        description: "1-hour session to prep for quiz.",
        reward: 90,
        xp: 45,
        urgency: "low",
        deadline: "Tomorrow, 10:00 AM",
        deadlineIso: new Date(now.getTime() + 24 * 60 * 60000).toISOString(),
        location: "Library",
        highlighted: true,
        otp: "0000",
        postedBy: "AmitK",
        status: "open"
      },
      {
        title: "Print Assignment",
        description: "Print 10 pages and deliver to Block A, Room 204.",
        reward: 30,
        xp: 15,
        urgency: "medium",
        deadline: formatDisplay(180),
        deadlineIso: getIso(180),
        location: "Block A",
        otp: "0000",
        postedBy: "SnehaG",
        status: "open"
      },
    ];
  };

  const [quests, setQuests] = useState<Quest[]>([]);

// Load Quests from Backend
useEffect(() => {
  const fetchQuests = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/quests');
      const data = await res.json();
      setQuests(data);
    } catch (err) {
      console.error("Failed to load quests:", err);
    }
  };

  fetchQuests();
  // Poll for updates every 5 seconds (Real-time-ish!)
  const interval = setInterval(fetchQuests, 5000);
  return () => clearInterval(interval);
}, []);

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

  // --- ACTIONS ---

  const addQuest = async (newQuestData: any) => {
    // 1. Client-side check (Optional, but makes UI faster)
    if (balance < newQuestData.reward) {
      showToast("error", "Insufficient Balance", "Add money to your wallet.");
      return;
    }

    try {
      // 2. Send to Backend
      const response = await fetch('http://localhost:5000/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newQuestData,
          deadlineIso: new Date(new Date().getTime() + 60 * 60000).toISOString(), // Default 1 hour
          postedBy: currentUser.username
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // This catches the Backend's "Insufficient balance" error
        showToast("error", "Error", data.message || "Failed to post quest");
        return;
      }

      // 3. Success! Update UI
      setBalance(prev => prev - newQuestData.reward); 
      
      // ADDED THIS BACK: Update visual history
      addTransaction("debit", `Escrow: ${data.title}`, newQuestData.reward);
      
      addNotification("Quest Posted", `"${data.title}" is live!`);
      
      // Refresh list with new data from server
      setQuests(prev => [data, ...prev]);
      setActiveTab("find");
      
    } catch (error) {
      showToast("error", "Network Error", "Is the backend running?");
    }
  };

  const handleAcceptQuest = (quest: Quest) => {
    if (activeQuest) {
      showToast("error", "One Quest at a Time!", "Finish your current task first.");
      return;
    }

    // --- SECURITY UPGRADE: GENERATE OTP NOW ---
    const secureOTP = Math.floor(1000 + Math.random() * 9000).toString();

    const questWithOtp = { 
      ...quest, 
      otp: secureOTP // Fresh OTP assigned on acceptance
    };

    setActiveQuest(questWithOtp);
    addNotification("Quest Accepted", `You accepted "${quest.title}". Good luck!`);
    setIsChatOpen(true);
  };

  const handleCompleteQuest = () => {
    if (activeQuest && currentUser) {
      const reward = activeQuest.reward;
      const xp = activeQuest.xp;
      
      setBalance(prev => prev + reward);
      addTransaction("credit", `Reward: ${activeQuest.title}`, reward);
      setActivityLog(prev => [activeQuest, ...prev]);
      
      // Mark as completed in global list (Removes from Find tab)
      const updatedQuests = quests.map(q => 
        q.title === activeQuest.title ? { ...q, status: "completed" as const } : q
      );
      setQuests(updatedQuests);
      localStorage.setItem("campus_jugaad_quests", JSON.stringify(updatedQuests));

      // Update User XP
      const updatedUser = { ...currentUser, xp: (currentUser.xp || 0) + xp };
      setCurrentUser(updatedUser);
      localStorage.setItem("campus_jugaad_current_user", JSON.stringify(updatedUser));
      
      addNotification("Quest Completed!", `You earned ₹${reward} and ${xp} XP!`, "success");
      showToast("success", "Quest Completed!", `₹${reward} added.`);
      
      setActiveQuest(null);
      setIsChatOpen(false);
    }
  };

  const handleWithdraw = (amount: number) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      addTransaction("debit", "Withdrawal", amount);
      addNotification("Withdrawal", `₹${amount} transferred to bank.`);
      showToast("success", "Withdrawal Successful", `₹${amount} transferred.`);
    } else {
      showToast("error", "Insufficient Funds", "Not enough balance.");
    }
  };

  const handleAddMoney = (amount: number) => {
    setBalance(prev => prev + amount);
    addTransaction("credit", "Wallet Recharge", amount);
    addNotification("Money Added", `₹${amount} added to wallet.`, "success");
    showToast("success", "Money Added", `₹${amount} added.`);
  };

  // --- RENDER ---
  if (!currentUser) return <AuthPage onLogin={handleLogin} onGuest={handleGuestLogin} />;

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
        
        {/* Pass filtered quests (exclude completed) */}
        {activeTab === "find" && (
          <HeroView 
            quests={quests.filter(q => q.status !== "completed")} 
            onAcceptQuest={handleAcceptQuest} 
            activeQuest={activeQuest} 
          />
        )}
        
        {activeTab === "dashboard" && (
            <DashboardView 
                currentUser={currentUser} 
                activeQuest={activeQuest}
                activityLog={activityLog}
                postedQuests={quests.filter(q => q.postedBy === currentUser.username)}
            />
        )}
        
        {activeTab === "leaderboard" && <LeaderboardView currentUser={currentUser} />}

        <Footer />
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {activeQuest && (
        <ActiveQuestBar 
          quest={activeQuest}
          onComplete={handleCompleteQuest}
          onDismiss={() => {}} 
          isChatOpen={isChatOpen}
          onChatToggle={() => setIsChatOpen(!isChatOpen)}
        />
      )}

      {activeQuest && (
        <ChatInterface 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          questTitle={activeQuest.title}
          questLocation={activeQuest.location}
          questReward={activeQuest.reward}
          secretOTP={activeQuest.otp} // This is now the Fresh Secure OTP
        />
      )}

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