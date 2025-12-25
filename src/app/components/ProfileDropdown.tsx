import { User, CreditCard, ClipboardList, Star, HelpCircle, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

export function ProfileDropdown({ isOpen, onClose, onNavigate }: ProfileDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { icon: User, label: "My Details", action: "details" },
    { icon: CreditCard, label: "Payment Info", action: "payment" },
    { icon: ClipboardList, label: "Recent Tasks", action: "tasks" },
    { icon: Star, label: "My Ratings", action: "ratings" },
    { icon: HelpCircle, label: "Support", action: "support" },
  ];

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-64 bg-[var(--campus-card-bg)] backdrop-blur-xl rounded-2xl border border-[var(--campus-border)] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--campus-border)] bg-gradient-to-r from-[#2D7FF9]/10 to-[#9D4EDD]/10">
        <p className="text-[var(--campus-text-primary)]">Rishav</p>
        <p className="text-sm text-[var(--campus-text-secondary)]">Level 5 Hero</p>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {menuItems.map((item) => (
          <button
            key={item.action}
            onClick={() => {
              onNavigate?.(item.action);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-[var(--campus-text-secondary)] hover:text-[var(--campus-text-primary)] hover:bg-[var(--campus-border)] transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--campus-border)]" />

      {/* Logout */}
      <button
        onClick={() => {
          onNavigate?.("logout");
          onClose();
        }}
        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );
}
