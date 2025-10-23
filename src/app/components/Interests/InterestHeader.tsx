"use client";

interface InterestHeaderProps {
  isOnline: boolean;
}

export default function InterestHeader({ isOnline }: InterestHeaderProps) {
  const sf = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
  };

  return (
    <>
      {!isOnline && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 enter-fade" style={{ animationDelay: "0.1s" }}>
          <div
            className="bg-orange-50/90 border border-orange-200 rounded-full px-3 py-1 flex items-center gap-2 shadow-sm"
            style={sf}
          >
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-orange-700">Offline</span>
          </div>
        </div>
      )}

      <div className="text-center mb-4 pt-4 sm:pt-6 enter-fade" style={{ animationDelay: "0.05s" }}>
        <div className="inline-block relative mb-2">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal mb-2 text-center leading-snug px-2 tracking-tight"
            style={sf}
          >
            What interests you?
          </h2>
        </div>
        <p
          className="text-sm md:text-base font-normal text-charcoal/70 leading-relaxed px-4 max-w-lg md:max-w-2xl mx-auto"
          style={sf}
        >
          Pick a few things you love and let&apos;s personalise your experience!
        </p>
      </div>
    </>
  );
}
