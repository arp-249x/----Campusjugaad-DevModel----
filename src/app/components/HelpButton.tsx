import { MessageCircle } from "lucide-react";
import { useState } from "react";

export function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-[#2D7FF9] to-[#9D4EDD] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all z-50 group"
      >
        <MessageCircle className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2D7FF9] to-[#9D4EDD] blur-lg opacity-50 -z-10"></div>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 w-80 bg-[#1A1D21] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2D7FF9] to-[#9D4EDD] px-6 py-4">
            <h3 className="text-white">Need Help?</h3>
            <p className="text-white/80 text-sm">We're here to assist you!</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="text-gray-400 text-sm">
              Chat with our support team or browse our FAQ.
            </div>
            
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm transition-colors text-left">
                💬 Start Live Chat
              </button>
              <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm transition-colors text-left">
                📚 View FAQ
              </button>
              <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm transition-colors text-left">
                🤖 Talk to AI Assistant
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
