// src/app/components/Footer.tsx
import React from 'react';

export function Footer() {
  return (
    <footer className="w-full py-10 border-t border-[var(--campus-border)] bg-[var(--campus-bg)]/30 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 text-center">
        <p className="text-[var(--campus-text-secondary)] text-sm md:text-base font-medium tracking-wide">
          Made with love by <span className="bg-gradient-to-r from-[#2D7FF9] to-[#9D4EDD] bg-clip-text text-transparent font-bold">Team Sashwat</span> <span className="text-red-500">❤️</span>
        </p>
        <p className="text-[var(--campus-text-secondary)] text-[10px] mt-2 opacity-50 uppercase tracking-widest">
          © 2024 CampusJugaad • All Quests Reserved
        </p>
      </div>
      {/* This spacer prevents the Mobile Bottom Navigation from hiding the text */}
      <div className="h-16 md:hidden" />
    </footer>
  );
}