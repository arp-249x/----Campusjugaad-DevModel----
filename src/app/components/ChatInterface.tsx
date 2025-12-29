import { Send, X, Minus, Bot, CheckCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// ❌ DELETED: import { io } from "socket.io-client"; (We don't want this anymore!)

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  messages: any[];
  onSendMessage: (text: string) => void;
  isOnline?: boolean;
  isTyping?: boolean;
  // 👇 UPDATED PROP
  onTyping?: (isTyping: boolean) => void;
  
  // Legacy
  questTitle?: string;
  questLocation?: string;
  questReward?: number;
  secretOTP?: string;
  questId?: string; 
  currentUser?: any;
}

export function ChatInterface({ 
  isOpen, onClose, title, messages = [], onSendMessage, 
  isOnline = false, isTyping = false, onTyping
}: ChatInterfaceProps) {
  
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null); // To stop typing automatically

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen, isMinimized, isTyping]);

  const handleInputChange = (e: any) => {
      setInputValue(e.target.value);
      
      // 1. Tell Parent: "I am typing"
      onTyping?.(true);
      
      // 2. Clear old timer
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      // 3. Set new timer to stop "typing" after 2 seconds
      typingTimeoutRef.current = setTimeout(() => {
          onTyping?.(false);
      }, 2000);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue("");
    onTyping?.(false); // Stop typing immediately on send
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  if (!isOpen) return null;

  if (isMinimized) {
     // ... (Keep your minimized UI code here) ...
     return (
      <div onClick={() => setIsMinimized(false)} className="fixed bottom-24 right-4 z-50 bg-[#2D7FF9] text-white p-3 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform animate-bounce border-2 border-white">
        <Avatar className="h-10 w-10 border-2 border-white"><AvatarFallback><Bot className="w-6 h-6" /></AvatarFallback></Avatar>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 md:bottom-24 md:right-8 w-[95vw] md:w-[380px] h-[600px] bg-[var(--campus-card-bg)] backdrop-blur-xl border border-[var(--campus-border)] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden font-sans animate-in slide-in-from-bottom-10 fade-in duration-300">
      
      {/* HEADER */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--campus-border)] bg-[#2D7FF9]/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-[#2D7FF9]">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${title}`} />
              <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
            </Avatar>
            {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-[var(--campus-card-bg)] rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>}
          </div>
          <div>
            <h3 className="font-bold text-[var(--campus-text-primary)] text-sm">{title}</h3>
            <p className="text-xs text-[var(--campus-text-secondary)]">
                {isTyping ? <span className="text-[#2D7FF9] animate-pulse">Typing...</span> : (isOnline ? "Online" : "Offline")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
            <Button onClick={() => setIsMinimized(true)} variant="ghost" size="icon"><Minus className="w-4 h-4"/></Button>
            <Button onClick={onClose} variant="ghost" size="icon"><X className="w-4 h-4"/></Button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, index) => {
            const isMe = msg.sender === "user";
            return (
              <div key={index} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm break-words ${
                    isMe ? "bg-[#2D7FF9] text-white rounded-tr-none" : "bg-[var(--campus-surface)] border border-[var(--campus-border)] text-[var(--campus-text-primary)] rounded-tl-none"
                }`}>
                  {msg.text}
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-[var(--campus-text-secondary)] opacity-70">
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-blue-400" />}
                </div>
              </div>
            );
        })}
        {isTyping && (
            <div className="flex items-start gap-2 animate-in fade-in zoom-in duration-300">
                <div className="bg-[var(--campus-surface)] p-3 rounded-2xl rounded-tl-none border border-[var(--campus-border)]">
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-[var(--campus-border)] bg-[var(--campus-bg)]">
        <div className="flex items-center gap-2">
          <Input 
              value={inputValue}
              onChange={handleInputChange} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="w-full bg-[var(--campus-surface)] border-none rounded-full"
          />
          <Button onClick={handleSend} className="rounded-full bg-[#2D7FF9] w-10 h-10 p-0"><Send className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  );
}