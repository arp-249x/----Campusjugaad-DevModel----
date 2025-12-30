import { Send, X, Minus, Sparkles, Loader2, Paperclip, Image as ImageIcon, WifiOff, User, Bot } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Message {
  id: string;
  sender: "user" | "taskmaster" | "ai" | "other";
  text: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  messages: any[]; // Received from App.tsx (Backend or AI)
  onSendMessage: (text: string) => void;
  // Legacy/Fallback props
  questTitle?: string;
  questLocation?: string;
  questReward?: number;
  secretOTP?: string;
}

export function ChatInterface({ 
  isOpen, 
  onClose, 
  title, 
  messages = [], 
  onSendMessage,
  questTitle,
  questLocation,
  secretOTP 
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 right-4 z-50 bg-[#2D7FF9] text-white p-3 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform animate-bounce border-2 border-white"
      >
        <Avatar className="h-10 w-10 border-2 border-white">
          <AvatarFallback className="bg-white text-[#2D7FF9] font-bold">
            <Bot className="w-6 h-6" />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 md:bottom-24 md:right-8 w-[95vw] md:w-[380px] h-[600px] md:h-[500px] bg-[var(--campus-card-bg)] backdrop-blur-xl border border-[var(--campus-border)] rounded-2xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--campus-border)] bg-[#2D7FF9]/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-[#2D7FF9]">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-[#2D7FF9] text-white">
                 <Bot className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-[var(--campus-card-bg)] rounded-full bg-green-500"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[var(--campus-text-primary)] text-sm truncate max-w-[150px]" title={title}>
                {title || "Chat"}
              </h3>
            </div>
            <p className="text-xs text-[var(--campus-text-secondary)] opacity-80">
              {questTitle ? "Quest Active" : "Support"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="h-8 w-8 text-[var(--campus-text-secondary)]">
            <Minus className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-red-500/20 text-[var(--campus-text-secondary)] hover:text-red-500">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="text-center text-[var(--campus-text-secondary)] mt-10 opacity-50">
            <p className="text-sm">Start the conversation...</p>
            {secretOTP && <p className="text-xs mt-2 text-yellow-500/50">(Debug: OTP is {secretOTP})</p>}
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender === "user";
            return (
              <div key={msg.id || index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe && (
                   <div className="w-6 h-6 rounded-full bg-gray-600/20 flex items-center justify-center mr-2 mt-1">
                      <span className="text-[10px]">TM</span>
                   </div>
                )}
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm break-words ${
                    isMe 
                      ? "bg-[#2D7FF9] text-white rounded-tr-none" 
                      : "bg-[var(--campus-surface)] border border-[var(--campus-border)] text-[var(--campus-text-primary)] rounded-tl-none"
                  }`}>
                  {msg.text}
                  <div className={`text-[9px] mt-1 opacity-70 ${isMe ? "text-blue-100" : "text-[var(--campus-text-secondary)]"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-[var(--campus-border)] bg-[var(--campus-bg)]">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="w-full bg-[var(--campus-surface)] border-none focus-visible:ring-1 focus-visible:ring-[#2D7FF9] text-[var(--campus-text-primary)] pr-10 rounded-full"
            />
          </div>
          <Button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="h-9 w-9 rounded-full bg-[#2D7FF9] hover:bg-[#2D7FF9]/90 text-white p-0 flex items-center justify-center"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}