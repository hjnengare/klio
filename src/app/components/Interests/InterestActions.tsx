"use client";

import { ArrowRight } from "react-feather";

interface InterestActionsProps {
  canProceed: boolean;
  isNavigating: boolean;
  selectedCount: number;
  minSelections: number;
  onContinue: () => void;
  onSkip: () => void;
}

export default function InterestActions({ 
  canProceed, 
  isNavigating, 
  selectedCount, 
  minSelections, 
  onContinue, 
  onSkip 
}: InterestActionsProps) {
  const livvic = {
    fontFamily: '"Livvic", sans-serif',
    fontWeight: 600,
  };

  return (
    <div className="pt-4 space-y-4 enter-fade" style={{ animationDelay: "0.15s" }}>
      <button
        className={`w-full text-sm font-600 py-4 px-4 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-target btn-press ${
          canProceed
            ? 'bg-gradient-to-r from-sage to-sage/80 text-white hover:from-sage/90 hover:to-sage'
            : 'bg-charcoal/10 text-charcoal/40 cursor-not-allowed'
        }`}
        onClick={onContinue}
        disabled={!canProceed}
        aria-label={`Continue with ${selectedCount} selected interests`}
        style={{ fontFamily: '"Livvic", sans-serif', fontWeight: 600 }}
      >
        {isNavigating ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Continuing...
          </>
        ) : (
          <>
            Continue {selectedCount > 0 && `(${selectedCount} selected)`}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </>
        )}
      </button>

      <div className="text-center">
        <button
          type="button"
          className="inline-block text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-300 focus:outline-none focus:underline underline decoration-dotted"
          aria-label="Skip interest selection for now"
          style={livvic}
          onClick={onSkip}
          disabled={isNavigating}
        >
          Skip for now
        </button>
        <div className="mt-1 text-xs text-charcoal/50 max-w-sm mx-auto" style={livvic}>
          {selectedCount < minSelections ? (
            <span>We&apos;ll suggest popular local businesses instead</span>
          ) : (
            <span>You can always update your interests later in settings</span>
          )}
        </div>
      </div>
    </div>
  );
}
