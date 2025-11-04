"use client";

export default function SubcategoryHeader() {
  const sfPro = {
    fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
  };

  return (
    <div className="text-center mb-6 pt-4 sm:pt-6 enter-fade">
      <h2
        className="text-lg md:text-lg lg:text-4xl font-bold text-charcoal mb-2 tracking-tight"
        style={sfPro}
      >
        Choose your subcategories
      </h2>
      <p
        className="text-sm md:text-base text-charcoal/70 leading-relaxed px-4 max-w-lg mx-auto"
        style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}
      >
        Select specific areas within your interests
      </p>
    </div>
  );
}
