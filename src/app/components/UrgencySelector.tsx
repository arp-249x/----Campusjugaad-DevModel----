import { Flame } from "lucide-react";

type UrgencyLevel = "low" | "medium" | "high";

interface UrgencySelectorProps {
  value: UrgencyLevel;
  onChange: (level: UrgencyLevel) => void;
}

export function UrgencySelector({ value, onChange }: UrgencySelectorProps) {
  const options: { level: UrgencyLevel; label: string; flames: number }[] = [
    { level: "low", label: "LOW", flames: 1 },
    { level: "medium", label: "MEDIUM", flames: 2 },
    { level: "high", label: "HIGH", flames: 3 },
  ];

  const getColors = (level: UrgencyLevel) => {
    switch (level) {
      case "low":
        return {
          bg: "bg-[#2D7FF9]",
          text: "text-[#2D7FF9]",
          border: "border-[#2D7FF9]",
          glow: "shadow-[#2D7FF9]/50",
        };
      case "medium":
        return {
          bg: "bg-[#9D4EDD]",
          text: "text-[#9D4EDD]",
          border: "border-[#9D4EDD]",
          glow: "shadow-[#9D4EDD]/50",
        };
      case "high":
        return {
          bg: "bg-gradient-to-r from-[#FF4800] to-[#FF6B35]",
          text: "text-[#FF4800]",
          border: "border-[#FF4800]",
          glow: "shadow-[#FF4800]/50",
        };
    }
  };

  return (
    <div className="flex gap-2 w-full">
      {options.map((option) => {
        const isSelected = value === option.level;
        const colors = getColors(option.level);

        return (
          <button
            key={option.level}
            type="button"
            onClick={() => onChange(option.level)}
            className={`flex-1 py-4 rounded-xl border-2 transition-all duration-300 ${
              isSelected
                ? `${colors.bg} text-white border-transparent shadow-lg ${colors.glow}`
                : `bg-transparent ${colors.text} ${colors.border} hover:bg-opacity-10 hover:${colors.bg.replace("bg-", "bg-opacity-5")}`
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              {/* Flame Icons */}
              <div className="flex gap-0.5">
                {Array.from({ length: option.flames }).map((_, i) => (
                  <Flame
                    key={i}
                    className={`w-5 h-5 ${
                      isSelected ? "fill-white animate-pulse" : "fill-current"
                    }`}
                    style={{
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
              {/* Label */}
              <span className="text-xs tracking-wider">{option.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
