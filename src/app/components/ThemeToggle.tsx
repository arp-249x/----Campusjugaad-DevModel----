import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl text-[var(--campus-text-secondary)] hover:text-[var(--campus-text-primary)] hover:bg-[var(--campus-surface)] transition-all relative group"
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${
            theme === 'dark' ? 'rotate-[360deg] scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`} 
        />
        <Moon 
          className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${
            theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`} 
        />
      </div>
    </button>
  );
}