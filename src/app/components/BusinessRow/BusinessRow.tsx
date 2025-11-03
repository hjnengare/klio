// src/components/BusinessRow/BusinessRow.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "react-feather";
import BusinessCard, { Business } from "../BusinessCard/BusinessCard";
import ScrollableSection from "../ScrollableSection/ScrollableSection";

export default function BusinessRow({
  title,
  businesses,
  cta = "View All",
  href = "/home",
}: {
  title: string;
  businesses: Business[];
  cta?: string;
  href?: string;
}) {
  const router = useRouter();

  if (!businesses || businesses.length === 0) return null;

  return (
    <section
      className="relative"
      aria-label={title}
      data-section
      style={{
        fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      <div className="container mx-auto max-w-[1300px] px-4 sm:px-6 relative z-10">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm sm:text-base font-600 text-charcoal hover:text-sage transition-all duration-300 px-3 sm:px-4 py-1 hover:bg-sage/5 rounded-lg cursor-default" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
            {title}
          </h2>

          <button
            onClick={() => router.push(href)}
            className="group inline-flex items-center gap-1 text-sm font-semibold text-primary/80 transition-all duration-300 hover:text-sage focus:outline-none focus:ring-2 focus:ring-sage/30 rounded-full px-4 py-2 -mx-2 relative overflow-hidden"
            aria-label={`${cta}: ${title}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sage/10 to-coral/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 backdrop-blur-sm bg-off-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>
              {cta}
            </span>
            <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        <ScrollableSection>
          {/* Gap harmonizes with card radius/shadows; list semantics preserved via <li> inside cards */}
          <div className="flex gap-3 items-stretch">
            {businesses.map((business) => (
              <div key={business.id} className="list-none flex">
                <BusinessCard business={business} />
              </div>
            ))}
          </div>
        </ScrollableSection>
      </div>
    </section>
  );
}
