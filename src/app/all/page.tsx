"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import BusinessCard, { Business } from "../components/BusinessCard/BusinessCard";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { TRENDING_BUSINESSES, NEARBY_FAVORITES } from "../data/businessData";



// Combine all business data
const allBusinesses: Business[] = [...TRENDING_BUSINESSES, ...NEARBY_FAVORITES];

export default function ExploreGemsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedRating, setSelectedRating] = useState("All Ratings");
  const [selectedDistance, setSelectedDistance] = useState("All Distances");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredBusinesses = allBusinesses.filter(business => {
    // Search query filter - searches name, category, and description
    const searchMatch = !searchQuery ||
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (business.description && business.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const categoryMatch = selectedCategory === "All Categories" || business.category === selectedCategory;
    
    let ratingMatch = true;
    if (selectedRating === "4.5+ Stars") ratingMatch = business.totalRating >= 4.5;
    else if (selectedRating === "4.0+ Stars") ratingMatch = business.totalRating >= 4.0;
    else if (selectedRating === "3.5+ Stars") ratingMatch = business.totalRating >= 3.5;
    
    return searchMatch && categoryMatch && ratingMatch;
  });

  return (
    <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white relative overflow-hidden">
      {/* Static background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/3 via-transparent to-coral/3" />
        <div className="absolute inset-0 bg-gradient-to-tr from-off-white/50 via-transparent to-off-white/30" />
      </div>

      {/* Header */}
      <Header />

      {/* Main content with proper spacing */}
      <div className="pt-4 pb-6 relative z-10">
        {/* Filter tags section */}
        <div className="px-4 sm:px-6 md:px-8 mb-6">
          <div className="max-w-[1300px] mx-auto">
            <div className="flex gap-2 flex-wrap justify-center">
              {selectedCategory !== "All Categories" && (
                <span className="px-3 py-1 bg-sage/10 text-sage font-urbanist font-600 rounded-full text-sm flex items-center gap-2">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("All Categories")}>
                    <ion-icon name="close" class="text-base" />
                  </button>
                </span>
              )}
              {selectedRating !== "All Ratings" && (
                <span className="px-3 py-1 bg-coral/10 text-coral font-urbanist font-600 rounded-full text-sm flex items-center gap-2">
                  {selectedRating}
                  <button onClick={() => setSelectedRating("All Ratings")}>
                    <ion-icon name="close" class="text-base" />
                  </button>
                </span>
              )}
              {selectedDistance !== "All Distances" && (
                <span className="px-3 py-1 bg-sage/10 text-sage font-urbanist font-600 rounded-full text-sm flex items-center gap-2">
                  {selectedDistance}
                  <button onClick={() => setSelectedDistance("All Distances")}>
                    <ion-icon name="close" class="text-base" />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main businesses grid */}
        <div className="px-4 sm:px-6 md:px-8">
          <div className="max-w-[1300px] mx-auto">
            {/* Back home arrow */}
            <button
              onClick={() => router.push("/home")}
              className="group flex items-center gap-2 mb-6 font-urbanist font-600 text-charcoal/70 transition-all duration-300 hover:text-sage text-sm"
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-[-1px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back Home</span>
            </button>

            <div className="mb-6">
              <p className="font-urbanist text-charcoal/70 font-600">
                Showing {filteredBusinesses.length} results
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBusinesses.map((business) => (
                <div key={business.id} className="animate-fade-in-up">
                  <BusinessCard business={business} />
                </div>
              ))}
            </div>

            {filteredBusinesses.length === 0 && (
              <div className="text-center py-16">
                <ion-icon name="search" class="text-6xl text-charcoal/20 mb-4" />
                <h3 className="font-urbanist font-700 text-xl text-charcoal/60 mb-2">No results found</h3>
                <p className="font-urbanist text-charcoal/40">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}