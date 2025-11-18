"use client";

export default function DealBreakerHeader() {
  const titleStyle = {
    fontFamily: '"Urbanist", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  } as React.CSSProperties;
  const bodyStyle = {
    fontFamily: "'Urbanist', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    fontWeight: 400,
  } as React.CSSProperties;

  return (
    <div className="text-center mb-6 pt-4 sm:pt-6 enter-fade">
      <h2
        className="text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal mb-2 tracking-tight"
        style={titleStyle}
      >
        What are your deal-breakers?
      </h2>
      <p
        className="text-sm md:text-base text-charcoal/70 leading-relaxed px-4 max-w-lg mx-auto"
        style={bodyStyle}
      >
        Select what matters most to you in a business
      </p>
    </div>
  );
}
