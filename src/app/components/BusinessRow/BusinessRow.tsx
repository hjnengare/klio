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
      className="relative m-0 p-0 w-full"
      aria-label={title}
      data-section
      style={{
        fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      <div className="container max-w-[1300px] relative z-10 m-0 p-2">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <h2
            className="text-sm font-600 text-charcoal hover:text-sage transition-all duration-300 px-3 sm:px-4 py-1 hover:bg-sage/5 rounded-lg cursor-default"
            style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
          >
            {title}
          </h2>

          <button
            onClick={() => router.push(href)}
            className="group inline-flex items-center gap-1 text-sm font-semibold text-navbar-bg/90 transition-all duration-300 hover:text-sage focus:outline-none rounded-full px-4 py-2 -mx-2 relative overflow-hidden"
            aria-label={`${cta}: ${title}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sage/10 to-coral/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span
              className="relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5 text-navbar-bg/90 group-hover:text-sage"
              style={{ fontFamily: '"DM Sans", system-ui, sans-serif', fontWeight: 600 }}
            >
              {cta}
            </span>
            <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 text-navbar-bg/90 group-hover:text-sage" />
          </button>
        </div>

        <ScrollableSection>
          {/* Gap harmonizes with card radius/shadows; list semantics preserved via <li> inside cards */}
          <div className="flex gap-3 items-stretch pt-2">
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
