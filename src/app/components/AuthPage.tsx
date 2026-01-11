import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowRight, Sparkles, AlertTriangle, Ghost, Mail, CheckCircle2, Loader2, Timer } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { useToast } from "./ToastContext";

interface AuthPageProps {
  onLogin: (user: any) => void;
  onGuest: () => void;
}

export function AuthPage({ onLogin, onGuest }: AuthPageProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const { showToast } = useToast();
  
  // Form States
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    dob: "",
    password: ""
  });
  
  const [error, setError] = useState("");
  
  // --- OTP STATES ---
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // --- SPAM PROTECTION STATES ---
  const [resendCooldown, setResendCooldown] = useState(0); 
  const [resendAttempts, setResendAttempts] = useState(0); 

  // --- PUN LOGIC ---
  const [currentPun, setCurrentPun] = useState(""); 
  const [fieldPuns, setFieldPuns] = useState<Record<string, string>>({});

  // 1. LOAD SAVED STATE ON MOUNT (Fixes Refresh Vulnerability)
  useEffect(() => {
    const savedAttempts = localStorage.getItem("otp_attempts");
    const savedCooldownEnd = localStorage.getItem("otp_cooldown_end");

    if (savedAttempts) {
        setResendAttempts(parseInt(savedAttempts));
    }

    if (savedCooldownEnd) {
        const endTime = parseInt(savedCooldownEnd);
        const now = Date.now();
        if (endTime > now) {
            const remainingSeconds = Math.ceil((endTime - now) / 1000);
            setResendCooldown(remainingSeconds);
        }
    }
  }, []);

  // 2. TIMER LOGIC (Ticks down and updates UI)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
            if (prev <= 1) {
                // Cleanup when timer hits 0
                localStorage.removeItem("otp_cooldown_end");
                return 0;
            }
            return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    const punLibrary = {
      username: ["Captain Cool?", "TheOneWhoKnocks?", "IdentityTheftIsntAJoke", "FutureCEO", "MainCharacterVibes"],
      password: ["Relax, we aren't seeing it", "Secret sauce 🤫", "shhh... it's safe", "1234... just kidding", "Top secret clearance"],
      email: ["We won't spam (much)", "College ID preferred", "Slide into our database", "No owls, just emails"],
      dob: ["Age is just a number", "Level 1 started on...", "Technically an adult?", "Vintage year?"],
      name: ["What do friends call you?", "The legend themself", "Name on the degree"],
      default: "Ready to save the semester?"
    };

    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    setFieldPuns({
      username: getRandom(punLibrary.username),
      password: getRandom(punLibrary.password),
      email: getRandom(punLibrary.email),
      dob: getRandom(punLibrary.dob),
      name: getRandom(punLibrary.name),
      default: punLibrary.default
    });
    
    setCurrentPun(punLibrary.default);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleFocus = (field: string) => {
    if (fieldPuns[field]) {
      setCurrentPun(fieldPuns[field]);
    }
  };

  // Helper to actually call the API
  const sendOtpApi = async (email: string) => {
    setIsSendingOtp(true);
    try {
        const res = await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            setError(data.message || "Failed to send verification code.");
            return false;
        } 
        return true;
    } catch (err) {
        setError("Network error. Check internet connection.");
        return false;
    } finally {
        setIsSendingOtp(false);
    }
  };

  // --- STEP 1: VALIDATE & SEND OTP ---
  const handleInitiateRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.dob) {
      setError("Please fill in all fields!");
      return;
    }

    const allowedDomains = /@(gmail|outlook|yahoo|hotmail|live|icloud)\.com$/i;
    if (!allowedDomains.test(formData.email)) {
        setError("Please use a valid provider (Gmail, Outlook, Yahoo, etc.)");
        return;
    }

    const birthDate = new Date(formData.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 16) {
      setError("You must be at least 16 years old to join CampusJugaad.");
      return;
    }

    // Smart Send: Don't resend if timer is running, just show modal
    if (resendCooldown > 0) {
        setShowOtpModal(true);
        return;
    }

    // If max attempts reached, block immediately
    if (resendAttempts >= 3) {
        setError("Max OTP attempts reached. Please try again later.");
        return;
    }

    const success = await sendOtpApi(formData.email);
    if (success) {
        setShowOtpModal(true);
        startCooldown();
        incrementAttempts();
    }
  };

  // --- PERSISTENCE HELPERS ---
  const startCooldown = () => {
      const seconds = 30;
      setResendCooldown(seconds);
      // Save the FUTURE timestamp when cooldown ends
      const endTime = Date.now() + (seconds * 1000);
      localStorage.setItem("otp_cooldown_end", endTime.toString());
  };

  const incrementAttempts = () => {
      const newAttempts = resendAttempts + 1;
      setResendAttempts(newAttempts);
      localStorage.setItem("otp_attempts", newAttempts.toString());
  };

  // --- RESEND HANDLER ---
  const handleResendOtp = async () => {
    if (resendAttempts >= 3) return; 
    if (resendCooldown > 0) return; 

    const success = await sendOtpApi(formData.email);
    if (success) {
        startCooldown();
        incrementAttempts();
        showToast("success", "OTP Resent", `New code sent to ${formData.email}`);
    }
  };

  // --- STEP 2: VERIFY OTP & COMPLETE REGISTER ---
  const handleVerifyAndRegister = async () => {
    if (otpInput.length !== 6) {
        alert("Please enter the 6-digit code.");
        return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, otp: otpInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed. Invalid OTP?");
        return;
      }

      // Success - Clear restrictions
      localStorage.removeItem("otp_attempts");
      localStorage.removeItem("otp_cooldown_end");
      setShowOtpModal(false);
      onLogin(data); 
    } catch (err) {
      alert("Connection failed. Please try again.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }
      onLogin(data);
    } catch (err) {
      setError("Cannot connect to server. Is backend running?");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--campus-bg)] flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#2D7FF9]/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#9D4EDD]/20 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#2D7FF9] to-[#9D4EDD] bg-clip-text text-transparent mb-2">
            CampusJugaad
          </h1>
          <p className="text-[var(--campus-text-secondary)]">Delegate chaos. Be a Hero.</p>
        </div>

        <div className="bg-[var(--campus-card-bg)] backdrop-blur-xl border border-[var(--campus-border)] p-6 md:p-8 rounded-3xl shadow-2xl transition-all duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--campus-text-primary)]">
              {isRegistering ? "Join the Squad" : "Welcome Back"}
            </h2>
            <Sparkles className="w-6 h-6 text-[#F72585] animate-spin-slow" />
          </div>

          <form onSubmit={isRegistering ? handleInitiateRegister : handleLogin} className="space-y-4">
            
            <div className="h-6 text-center text-sm font-medium text-[#2D7FF9] transition-all duration-300">
              {currentPun || "Ready?"}
            </div>

            {isRegistering && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[var(--campus-text-secondary)]">Full Name</Label>
                  <Input 
                    placeholder="Real Name" 
                    className="bg-[var(--campus-bg)] border-[var(--campus-border)] text-[var(--campus-text-primary)]"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onFocus={() => handleFocus("name")}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--campus-text-secondary)]">Username</Label>
                  <Input 
                    placeholder="CoolName123" 
                    className="bg-[var(--campus-bg)] border-[var(--campus-border)] text-[var(--campus-text-primary)]"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    onFocus={() => handleFocus("username")}
                  />
                </div>
              </div>
            )}

            {isRegistering && (
               <div className="space-y-2">
                  <Label className="text-[var(--campus-text-secondary)]">Date of Birth</Label>
                  <Input 
                    type="date"
                    className="bg-[var(--campus-bg)] border-[var(--campus-border)] text-[var(--campus-text-primary)]"
                    value={formData.dob}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                    onFocus={() => handleFocus("dob")}
                  />
               </div>
            )}

            <div className="space-y-2">
              <Label className="text-[var(--campus-text-secondary)]">Email Address</Label>
              <Input 
                type="email" 
                placeholder="student@gmail.com" 
                className="bg-[var(--campus-bg)] border-[var(--campus-border)] text-[var(--campus-text-primary)]"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onFocus={() => handleFocus("email")}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[var(--campus-text-secondary)]">Password</Label>
              <div className="relative">
                <Input 
                  type="password"
                  placeholder="••••••••" 
                  className="bg-[var(--campus-bg)] border-[var(--campus-border)] pr-10 text-[var(--campus-text-primary)]"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  onFocus={() => handleFocus("password")}
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center font-medium animate-pulse">{error}</p>}

            <Button 
                className="w-full bg-gradient-to-r from-[#2D7FF9] to-[#9D4EDD] hover:opacity-90 transition-opacity h-12 text-lg font-bold shadow-lg text-white"
                disabled={isSendingOtp}
            >
              {isRegistering 
                ? (isSendingOtp ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Sending Code...</> : <>Verify & Register <ArrowRight className="ml-2 w-5 h-5" /></>) 
                : "Login"} 
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-4 text-center">
            <p className="text-[var(--campus-text-secondary)] text-sm">
              {isRegistering ? "Already have an account?" : "New to Campus?"} {" "}
              <button 
                onClick={() => { setIsRegistering(!isRegistering); setError(""); setCurrentPun(fieldPuns.default); }}
                className="text-[#2D7FF9] hover:underline font-bold"
              >
                {isRegistering ? "Login Here" : "Create Account"}
              </button>
            </p>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[var(--campus-border)]"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-[var(--campus-card-bg)] px-2 text-[var(--campus-text-secondary)]">For Judges</span></div>
            </div>

            <button 
              onClick={onGuest}
              className="text-sm text-[var(--campus-text-secondary)] hover:text-[var(--campus-text-primary)] flex items-center justify-center gap-2 transition-colors"
            >
              <Ghost className="w-4 h-4" /> Continue as Guest (Testing)
            </button>
          </div>
        </div>

        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl flex items-start gap-3 backdrop-blur-sm">
           <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
           <p className="text-xs text-yellow-200/80 leading-relaxed text-left">
             <span className="font-bold text-yellow-500">Note:</span> Guest Account only for UI Testing. <br/> Register/Login for posting/accepting quests!
           </p>
        </div>
      </div>

      {/* --- OTP DIALOG --- */}
      <Dialog open={showOtpModal} onOpenChange={(open) => {
          if (!isSendingOtp) setShowOtpModal(open);
      }}>
        <DialogContent className="bg-[var(--campus-card-bg)] border-[var(--campus-border)] text-[var(--campus-text-primary)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 bg-[#2D7FF9]/20 rounded-full flex items-center justify-center text-[#2D7FF9] mb-2">
                    <Mail className="w-6 h-6" />
                </div>
                Check your Inbox
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4 text-center">
            <p className="text-sm text-[var(--campus-text-secondary)]">
              We sent a 6-digit code to <br/> <span className="font-bold text-[var(--campus-text-primary)]">{formData.email}</span>
            </p>
            
            <div className="flex justify-center">
              <Input
                type="text"
                maxLength={6}
                placeholder="0 0 0 0 0 0"
                className="text-center text-3xl tracking-[0.5em] h-16 w-64 font-mono uppercase border-[var(--campus-border)] focus:ring-[#2D7FF9]"
                value={otpInput}
                onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                        setOtpInput(e.target.value);
                    }
                }}
              />
            </div>

            {/* Spam Proof Logic */}
            <p className="text-xs text-[var(--campus-text-secondary)] h-6 flex items-center justify-center gap-2">
                {resendAttempts >= 3 ? (
                    <span className="text-red-500 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Max attempts reached. Try again later.
                    </span>
                ) : resendCooldown > 0 ? (
                    <span className="text-[var(--campus-text-secondary)] opacity-50 flex items-center gap-1">
                        <Timer className="w-3 h-3" /> Resend available in {resendCooldown}s
                    </span>
                ) : (
                    <>
                        Didn't receive it? 
                        <button 
                            className="text-[#2D7FF9] hover:underline font-bold" 
                            onClick={handleResendOtp}
                            disabled={isSendingOtp}
                        >
                            {isSendingOtp ? "Sending..." : "Resend Code"}
                        </button>
                    </>
                )}
            </p>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button 
              onClick={handleVerifyAndRegister}
              disabled={otpInput.length !== 6}
              className="bg-[#00F5D4] text-black hover:bg-[#00F5D4]/80 w-full sm:w-auto min-w-[200px] font-bold"
            >
              Verify Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );

}
