import { CheckCircle, MessageSquare, ChevronUp, ChevronDown, AlertTriangle, Calendar } from "lucide-react"; // Added Calendar
import { useState } from "react";
import { motion } from "motion/react";
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
  _id?: string;
  title: string;
  reward: number;
  deadline: string;
  status?: string;
  postedBy?: string; 
  otp?: string;      
}

interface ActiveQuestBarProps {
  quest: Quest;
  onComplete: (otp: string) => void;
  onDismiss: () => void;
  onDispute: (quest: any) => void;
  isChatOpen: boolean;
  onChatToggle: () => void;
  currentUser: any; 
  hasUnread?: boolean;
}

export function ActiveQuestBar({ 
  quest, 
  onComplete, 
  onDismiss, 
  onDispute,
  isChatOpen, 
  onChatToggle,
  currentUser, 
  hasUnread
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

  const isTaskMaster = currentUser?.username === quest.postedBy;

  return (
    <>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-[var(--campus-card-bg)] backdrop-blur-xl border border-[var(--campus-border)] rounded-2xl shadow-2xl z-40 overflow-hidden"
      >
        <div className="p-4 flex items-center justify-between bg-gradient-to-r from-[#2D7FF9]/10 to-[#9D4EDD]/10">
          <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer flex-1 min-w-0 pr-2">
            <h3 className="font-semibold text-[var(--campus-text-primary)] flex items-center gap-2 text-sm md:text-base truncate">
              {quest.title}
              {isExpanded ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronUp className="w-4 h-4 shrink-0" />}
            </h3>
            
            {/* Deadline with responsive wrapping */}
            <div className="text-xs text-[var(--campus-text-secondary)] flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
              <span>Reward: <span className="text-[#00F5D4] font-bold">₹{quest.reward}</span></span>
              
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Due: <span className="text-[var(--campus-text-primary)]">{quest.deadline}</span></span>
              </div>

              {isTaskMaster && <span className="opacity-70 italic hidden sm:inline">(You are Task Master)</span>}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
             {/* Dispute Button */}
             <button
              onClick={() => onDispute(quest)}
              className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
              title="Report Issue"
            >
              <AlertTriangle className="w-5 h-5" />
            </button>

             {/* Chat Button */}
             <button
              onClick={onChatToggle}
              className={`relative p-2 rounded-full transition-colors ${
                isChatOpen 
                  ? "bg-[#2D7FF9] text-white" 
                  : "hover:bg-[var(--campus-border)] text-[var(--campus-text-secondary)]"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              {hasUnread && !isChatOpen && (
                 <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-[var(--campus-card-bg)]"></span>
              )}
            </button>

            {isTaskMaster ? (
                <div className="hidden md:flex flex-col items-end px-3 py-1 bg-black/20 rounded-lg border border-[#00F5D4]/30">
                  <span className="text-[10px] text-[var(--campus-text-secondary)] uppercase tracking-wider">Share OTP</span>
                  <span className="font-mono text-lg font-bold text-[#00F5D4] tracking-widest leading-none">
                    {quest.otp || "****"}
                  </span>
               </div>
            ) : (
                <button
                  onClick={() => setShowOtpModal(true)} 
                  className="flex items-center gap-2 px-4 py-2 bg-[#00F5D4] text-black rounded-lg font-medium hover:bg-[#00F5D4]/80 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Complete</span>
                </button>
            )}
          </div>
        </div>
        
        {/* Mobile View for OTP */}
        {isTaskMaster && isExpanded && (
           <div className="md:hidden bg-black/20 p-2 text-center border-t border-[var(--campus-border)]">
              <p className="text-xs text-[var(--campus-text-secondary)] mb-1">Share this OTP with the Hero:</p>
              <p className="font-mono text-xl font-bold text-[#00F5D4] tracking-[0.2em]">{quest.otp || "****"}</p>
           </div>
        )}
      </motion.div>

      {/* OTP Modal */}
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
