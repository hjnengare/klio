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

  const handleSeeMore = () => {
    router.push(href);
  };

  if (businesses.length === 0) return null;

  return (
    <section className="pb-2 sm:pb-3 sm:pt-1 bg-off-white relative" aria-label="businesses" data-section>
      {/* Subtle section decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-coral/8 to-transparent rounded-full blur-xl" />
      </div>

      <div className="container mx-auto max-w-[1300px] px-4 relative z-10">
        <div className="mb-3 sm:mb-5 flex flex-wrap items-center justify-between gap-[18px]">
          <h2 className="font-urbanist text-xl font-800 text-charcoal relative">
            {title}
          </h2>
          <button
            onClick={handleSeeMore}
            className="group font-urbanist font-700 text-charcoal/70 transition-all duration-300 hover:text-sage text-base premium-hover flex items-center gap-1"
          >
            <span className="transition-transform duration-300 group-hover:translate-x-[-2px]">
              See More
            </span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-[2px]" />
          </button>
        </div>

        <ScrollableSection>
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