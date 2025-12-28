import { Clock, CheckCircle2, ShieldCheck, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Button } from "./ui/button";

interface ActiveQuest {
  title: string;
  location?: string;
  deadlineIso: string; 
  otp: string; 
}

interface ActiveQuestBarProps {
  quest: ActiveQuest | null;
  onComplete?: () => void;
  onDismiss?: () => void;
  onChatToggle?: () => void;
  isChatOpen?: boolean;
}

export function ActiveQuestBar({ quest, onComplete, onDismiss, onChatToggle, isChatOpen }: ActiveQuestBarProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!quest?.deadlineIso) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const end = new Date(quest.deadlineIso).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft("EXPIRED");
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [quest]);

  if (!quest) return null;

  const handleVerify = () => {
    if (otpValue === quest.otp) {
      setIsVerificationOpen(false);
      setOtpValue("");
      setError(false);
      onComplete?.();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-[#2D7FF9] to-[#9D4EDD] border-t border-white/20 shadow-2xl shadow-[#2D7FF9]/30 backdrop-blur-xl animate-in slide-in-from-bottom duration-500 mb-16 md:mb-0">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex items-center gap-2 text-white min-w-0">
                <span className="hidden sm:inline text-sm opacity-80">Active Quest:</span>
                <span className="font-medium truncate">{quest.title}</span>
                {quest.location && (
                    <span className="hidden md:inline text-sm opacity-80">→ {quest.location}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-lg border border-white/20">
              <Clock className="w-4 h-4 text-white" />
              <span className="text-white font-mono text-sm md:text-base min-w-[80px] text-center">
                {timeLeft || "--:--:--"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onChatToggle}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border ${
                  isChatOpen 
                    ? "bg-white text-[#2D7FF9] border-white" 
                    : "bg-white/20 text-white border-transparent hover:bg-white/30"
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Chat</span>
                {!isChatOpen && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsVerificationOpen(true)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#00F5D4] hover:bg-[#00F5D4]/90 text-black rounded-lg transition-all shadow-lg hover:shadow-[#00F5D4]/50 hover:scale-105 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Verify & Complete</span>
                <span className="sm:hidden">Verify</span>
              </button>
              
              {/* REMOVED CLOSE BUTTON HERE */}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
        <DialogContent className="bg-[var(--campus-card-bg)] border-[var(--campus-border)]">
          <DialogHeader>
            <div className="mx-auto bg-[#00F5D4]/10 p-3 rounded-full mb-2">
              <ShieldCheck className="w-8 h-8 text-[#00F5D4]" />
            </div>
            <DialogTitle className="text-center text-[var(--campus-text-primary)]">Verify Completion</DialogTitle>
            <DialogDescription className="text-center text-[var(--campus-text-secondary)]">
              Ask the Task Master in the chat for the 4-digit OTP to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4 space-y-4">
            <InputOTP maxLength={4} value={otpValue} onChange={setOtpValue}>
              <InputOTPGroup>
                {[0,1,2,3].map(i => <InputOTPSlot key={i} index={i} className="border-[var(--campus-border)] text-[var(--campus-text-primary)]" />)}
              </InputOTPGroup>
            </InputOTP>
            {error && <p className="text-red-500 animate-pulse text-sm">Incorrect OTP! Please try again.</p>}
          </div>
          <DialogFooter>
            <Button onClick={handleVerify} className="w-full bg-[#00F5D4] text-black hover:bg-[#00F5D4]/80">Confirm Completion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}