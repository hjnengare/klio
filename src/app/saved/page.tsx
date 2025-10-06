"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Header from "../components/Header/Header";
import BusinessCard from "../components/BusinessCard/BusinessCard";
import ScrollableSection from "../components/ScrollableSection/ScrollableSection";
import { TRENDING_BUSINESSES } from "../data/businessData";

const ScrollReveal = dynamic(() => import("../components/Animations/ScrollReveal"), {
  ssr: false,
});

const Footer = dynamic(() => import("../components/Footer/Footer"), {
  loading: () => null,
  ssr: false,
});

export default function SavedPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const router = useRouter();

  // Mock saved businesses - in real app this would come from user data
  const savedBusinesses = TRENDING_BUSINESSES.slice(0, 3);
  const categories = ["All", "Restaurants", "Services", "Shopping"];

  return (
    <div className="min-h-dvh bg-off-white relative">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-coral/8 to-transparent rounded-full blur-2xl" />
      </div>

      {/* Main content */}
      <div className="pt-4 pb-6 relative z-10">
        <div className="px-4 sm:px-6 md:px-8 mb-6">
          <div className="max-w-[1300px] mx-auto">
            {/* Header with gradient text */}
            <ScrollReveal delay={0.1}>
              <div className="mb-8">
                <button
                  onClick={() => router.back()}
                  className="group flex items-center mb-6"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-charcoal/5 hover:border-sage/20 mr-3 sm:mr-4">
                    <ion-icon name="arrow-back" class="text-lg sm:text-xl text-charcoal/70 group-hover:text-sage transition-colors duration-300" />
                  </div>
                  <h1 className="font-urbanist text-base sm:text-xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal transition-all duration-300 group-hover:from-sage/90 group-hover:to-sage relative">
                    Saved Gems
                  </h1>
                </button>
                <p className="font-urbanist text-sm sm:text-base text-charcoal/70 max-w-md ml-14 sm:ml-16">
                  Your collection of favorite local spots
                </p>
              </div>
            </ScrollReveal>

            {/* Category Filter */}
            <ScrollReveal delay={0.2}>
              <ScrollableSection className="mb-8">
                <div className="flex space-x-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-6 py-3 rounded-full font-urbanist text-7 font-500 whitespace-nowrap transition-all duration-300 ${
                        selectedCategory === category
                          ? "bg-sage text-white shadow-lg"
                          : "bg-off-white text-charcoal/70 hover:bg-sage/10 hover:text-sage border border-charcoal/20"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </ScrollableSection>
            </ScrollReveal>

            {/* Saved Businesses */}
            {savedBusinesses.length > 0 ? (
              <ScrollReveal delay={0.3}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 list-none">
                  {savedBusinesses.map((business) => (
                    <div key={business.id} className="relative">
                      <BusinessCard business={business} />
                      {/* Saved indicator */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-coral rounded-full flex items-center justify-center shadow-lg">
                        <ion-icon
                          name="bookmark"
                          style={{ color: "white", fontSize: "16px" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            ) : (
              <ScrollReveal delay={0.3}>
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-sage/10 rounded-full flex items-center justify-center">
                    <ion-icon
                      name="bookmark-outline"
                      style={{ fontSize: "32px", color: "#749176" }}
                    />
                  </div>
                  <h3 className="font-urbanist text-5 font-600 text-charcoal mb-4">
                    No saved gems yet
                  </h3>
                  <p className="font-urbanist text-6 text-charcoal/70 mb-8 max-w-sm mx-auto">
                    Start exploring and save your favorite local businesses to see them here
                  </p>
                  <a
                    href="/all"
                    className="inline-flex items-center px-6 py-3 bg-sage text-white font-urbanist text-6 font-600 rounded-full hover:bg-sage/90 transition-all duration-300 shadow-lg"
                  >
                    <ion-icon name="search-outline" style={{ marginRight: "8px" }} />
                    Explore Gems
                  </a>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
