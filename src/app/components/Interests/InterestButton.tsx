"use client";

import { CheckCircle } from "lucide-react";

interface Interest {
  id: string;
  name: string;
}

interface InterestButtonProps {
  interest: Interest;
  isSelected: boolean;
  isDisabled: boolean;
  isAnimating: boolean;
  onToggle: (id: string) => void;
  index: number;
}

export default function InterestButton({ 
  interest, 
  isSelected, 
  isDisabled, 
  isAnimating, 
  onToggle, 
  index 
}: InterestButtonProps) {
  const sfPro = {
    fontFamily: "'Urbanist', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    fontWeight: 600,
  };

  const delay = Math.min(index, 8) * 0.03 + 0.1;

  return (
    <button
      data-interest-id={interest.id}
      onClick={() => onToggle(interest.id)}
      disabled={isDisabled}
      aria-pressed={isSelected}
      aria-label={`${interest.name}${
        isSelected ? " (selected)" : isDisabled ? " (maximum reached)" : ""
      }`}
      className={`
        enter-stagger
        relative z-30 w-[85%] aspect-square rounded-full transition-all duration-300 ease-out mx-auto min-h-[44px] min-w-[44px] touch-target-large
        focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2
        ${
          isSelected
            ? "bg-coral text-white shadow-[0_10px_40px_rgba(214,116,105,0.22),0_2px_8px_rgba(0,0,0,0.06)] scale-105"
            : isDisabled
            ? "bg-charcoal/5 text-charcoal/40 cursor-not-allowed opacity-60"
            : "bg-sage text-white hover:bg-sage/90 hover:scale-105 active:scale-95 shadow-[0_8px_24px_rgba(125,155,118,0.16)]"
        }
      `}
      style={{ ...sfPro, animationDelay: `${delay}s` }}
      suppressHydrationWarning
    >
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center p-4 ${
          isAnimating ? "animate-bubbly" : ""
        }`}
      >
        <span className="text-[15px] md:text-base font-semibold text-center leading-tight break-words hyphens-auto">
          {interest.name}
        </span>
        {isSelected && (
          <div className="absolute top-2 right-2">
            <CheckCircle className="w-5 h-5 text-sage" aria-hidden="true" />
          </div>
        )}
      </div>
    </button>
  );
}
