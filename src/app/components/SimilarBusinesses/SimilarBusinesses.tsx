"use client";

import { useEffect, useState, useMemo } from "react";
import { useBusinesses } from "../../hooks/useBusinesses";
import SimilarBusinessCard from "./SimilarBusinessCard";
import { Briefcase } from "react-feather";

interface SimilarBusinessesProps {
  currentBusinessId: string;
  category: string;
  location?: string;
  limit?: number;
}

export default function SimilarBusinesses({
  currentBusinessId,
  category,
  location,
  limit = 6,
}: SimilarBusinessesProps) {
  const { businesses, loading } = useBusinesses({
    category,
    location,
    limit: limit + 1, // Fetch one extra to account for excluding current business
    sortBy: "total_rating",
    sortOrder: "desc",
  });

  // Filter out current business and limit results
  const similarBusinesses = useMemo(() => {
    if (!businesses || businesses.length === 0) return [];
    return businesses
      .filter((b) => b.id !== currentBusinessId)
      .slice(0, limit)
      .map((b) => ({
        ...b,
        href: `/business/${b.id}`,
      }));
  }, [businesses, currentBusinessId, limit]);

  if (loading) {
    return (
      <section className="space-y-6" aria-labelledby="similar-businesses-heading">
        <div className="flex justify-center">
          <div className="flex flex-col gap-3">
            <h2
              id="similar-businesses-heading"
              className="text-h3 font-semibold text-charcoal border-b border-charcoal/10 pb-2"
              style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
            >
              Similar Businesses
            </h2>
          </div>
        </div>
        <ul className="list-none grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <li key={i}>
              <div className="h-[200px] bg-off-white/50 rounded-lg animate-pulse" />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (!similarBusinesses || similarBusinesses.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6" aria-labelledby="similar-businesses-heading">
      <div className="flex justify-center">
        <div className="flex flex-col gap-3">
          <h2
            id="similar-businesses-heading"
            className="text-h3 font-semibold text-charcoal border-b border-charcoal/10 pb-2 flex items-center gap-2"
            style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
          >
            <Briefcase className="w-5 h-5 text-sage" />
            Similar Businesses
          </h2>
        </div>
      </div>

      <ul className="list-none grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        {similarBusinesses.map((business) => (
          <li key={business.id}>
            <SimilarBusinessCard
              id={business.id}
              name={business.name}
              image={business.image}
              image_url={business.image_url}
              uploaded_image={business.uploaded_image}
              category={business.category}
              location={business.location}
              rating={business.rating}
              totalRating={business.totalRating}
              reviews={business.reviews}
              total_reviews={business.total_reviews}
              verified={business.verified}
              priceRange={business.priceRange}
              price_range={business.price_range}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

