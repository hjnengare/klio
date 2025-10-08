// src/components/BusinessRow/BusinessRow.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import BusinessCard, { Business } from "../BusinessCard/BusinessCard";
import ScrollableSection from "../ScrollableSection/ScrollableSection";

export default function BusinessRow({
  title,
  businesses,
  cta = "View All",
  href = "/all",
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
      className="pb-2 sm:pb-3 sm:pt-1 bg-white relative"
      aria-label={title}
      data-section
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      {/* Subtle section decoration (non-interactive) */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true">
        <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-xl" />
      </div>

      <div className="container mx-auto max-w-[1300px] px-4 relative z-10">
        <div className="mb-3 sm:mb-5 flex flex-wrap items-center justify-between gap-[18px]">
          <h2 className="text-xl font-semibold text-charcoal tracking-tight">
            {title}
          </h2>

          <button
            onClick={() => router.push(href)}
            className="group inline-flex items-center gap-1 text-base font-semibold text-charcoal/70 transition-all duration-300 hover:text-sage focus:outline-none focus:ring-2 focus:ring-sage/30 rounded-full px-2 -mx-2"
            aria-label={`${cta}: ${title}`}
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
              {cta}
            </span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        <ScrollableSection>
          {/* Gap harmonizes with card radius/shadows; list semantics preserved via <li> inside cards */}
          <div className="flex gap-6">
            {businesses.map((business) => (
              <div key={business.id} className="list-none">
                <BusinessCard business={business} />
              </div>
            ))}
          </div>
        </ScrollableSection>
      </div>
    </section>
  );
}
