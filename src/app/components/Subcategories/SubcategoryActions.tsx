"use client";

interface SubcategoryActionsProps {
  canProceed: boolean;
  isNavigating: boolean;
  isLoading: boolean;
  selectedCount: number;
  onContinue: () => void;
  onSkip: () => void;
}

export default function SubcategoryActions({ 
  canProceed, 
  isNavigating, 
  isLoading, 
  selectedCount, 
  onContinue, 
  onSkip 
}: SubcategoryActionsProps) {
  const sf = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
  };

  return (
    <>
      <div className="pt-6">
        <button
          className={`
            group block w-full text-white text-sm md:text-base font-semibold py-3.5 md:py-4 px-6 md:px-8 rounded-full transition-all duration-300 relative text-center
            ${canProceed
              ? "bg-[linear-gradient(135deg,#7D9B76_0%,#6B8A64_100%)] shadow-[0_10px_40px_rgba(125,155,118,0.25),0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(125,155,118,0.35),0_8px_24px_rgba(0,0,0,0.12)] focus:outline-none focus:ring-4 focus:ring-sage/30 focus:ring-offset-2"
              : "bg-charcoal/10 text-charcoal/40 cursor-not-allowed"
            }
          `}
          onClick={onContinue}
          disabled={!canProceed}
          style={sf}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {(isLoading || isNavigating) && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Continue {selectedCount > 0 && `(${selectedCount} selected)`}
          </span>
          {canProceed && (
            <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-coral to-coral/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </button>
      </div>

      {/* Skip for now */}
      <div className="text-center mt-3">
        <button
          type="button"
          className="inline-block text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-300 focus:outline-none focus:underline underline decoration-dotted"
          aria-label="Skip subcategory selection for now"
          style={sf}
          onClick={onSkip}
        >
          Skip for now
        </button>
      </div>
    </>
  );
}
