"use client";

export default function DealBreakerHeader() {
  const sf = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
  };

  return (
    <div className="text-center mb-6 pt-4 sm:pt-6 enter-fade">
      <h2
        className="text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal mb-2 tracking-tight"
        style={sf}
      >
        What are your deal-breakers?
      </h2>
      <p
        className="text-sm md:text-base text-charcoal/70 leading-relaxed px-4 max-w-2xl mx-auto"
        style={sf}
      >
        Select what matters most to you in a business
      </p>
    </div>
  );
}
