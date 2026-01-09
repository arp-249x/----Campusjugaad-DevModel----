// src/app/components/ActiveQuestBar.tsx

import { CheckCircle, MessageSquare, X, ChevronUp, ChevronDown, AlertTriangle } from "lucide-react"; // Added AlertTriangle
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog"; 
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface Quest {
  _id?: string; // Added _id
  title: string;
  reward: number;
  deadline: string;
  status?: string;
}

interface ActiveQuestBarProps {
  quest: Quest;
  onComplete: (otp: string) => void;
  onDismiss: () => void;
  onDispute: (quest: any) => void; // New prop
  isChatOpen: boolean;
  onChatToggle: () => void;
}

export function ActiveQuestBar({ 
  quest, 
  onComplete, 
  onDismiss, 
  onDispute, // Destructured
  isChatOpen, 
  onChatToggle 
}: ActiveQuestBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false); 
  const [otpInput, setOtpInput] = useState("");

  const handleSubmitOtp = () => {
    if (otpInput.length === 4) {
      onComplete(otpInput); 
      setShowOtpModal(false);
      setOtpInput("");
    }
  };

  return (
    <>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-[var(--campus-card-bg)] backdrop-blur-xl border border-[var(--campus-border)] rounded-2xl shadow-2xl z-40 overflow-hidden"
      >
        <div className="p-4 flex items-center justify-between bg-gradient-to-r from-[#2D7FF9]/10 to-[#9D4EDD]/10">
          <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
            <h3 className="font-semibold text-[var(--campus-text-primary)] flex items-center gap-2">
              Currently Active: {quest.title}
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </h3>
            <p className="text-xs text-[var(--campus-text-secondary)]">
              Reward: <span className="text-[#00F5D4]">₹{quest.reward}</span> • Due: {quest.deadline}
            </p>
          </div>

          <div className="flex items-center gap-2">
             {/* NEW DISPUTE BUTTON */}
             <button
              onClick={() => onDispute(quest)}
              className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
              title="Report Issue / Dispute"
            >
              <AlertTriangle className="w-5 h-5" />
            </button>

             <button
              onClick={onChatToggle}
              className={`p-2 rounded-full transition-colors ${
                isChatOpen 
                  ? "bg-[#2D7FF9] text-white" 
                  : "hover:bg-[var(--campus-border)] text-[var(--campus-text-secondary)]"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowOtpModal(true)} 
              className="flex items-center gap-2 px-4 py-2 bg-[#00F5D4] text-black rounded-lg font-medium hover:bg-[#00F5D4]/80 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Complete</span>
            </button>
          </div>
        </div>
      </motion.div>

      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="bg-[var(--campus-card-bg)] border-[var(--campus-border)] text-[var(--campus-text-primary)]">
          <DialogHeader>
            <DialogTitle>Verify Completion</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <p className="text-sm text-[var(--campus-text-secondary)]">
              Ask the Task Master for the 4-digit OTP to confirm you finished the job.
            </p>
            
            <div className="flex justify-center">
              <Input
                type="text"
                maxLength={4}
                placeholder="0 0 0 0"
                className="text-center text-3xl tracking-[1em] h-16 w-64 font-mono uppercase border-[var(--campus-border)]"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOtpModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitOtp}
              disabled={otpInput.length !== 4}
              className="bg-[#00F5D4] text-black hover:bg-[#00F5D4]/80"
            >
              Verify & Claim ₹{quest.reward}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}