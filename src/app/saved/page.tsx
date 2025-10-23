"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bookmark, Search } from "lucide-react";
import BusinessCard from "../components/BusinessCard/BusinessCard";
import { TRENDING_BUSINESSES } from "../data/businessData";
import EmailVerificationGuard from "../components/Auth/EmailVerificationGuard";
import { useSavedItems } from "../contexts/SavedItemsContext";

const ScrollReveal = dynamic(() => import("../components/Animations/ScrollReveal"), {
  ssr: false,
});

const Footer = dynamic(() => import("../components/Footer/Footer"), {
  loading: () => null,
  ssr: false,
});

export default function SavedPage() {
  const router = useRouter();
  const { savedItems } = useSavedItems();

  // Get saved businesses from the saved items context
  const savedBusinesses = TRENDING_BUSINESSES.filter(business =>
    savedItems.includes(business.id)
  );

  return (
    <EmailVerificationGuard>
      <div className="min-h-dvh bg-off-white relative">
     

      {/* Main content */}
      <div className="pt-24 pb-6 relative z-10">
        <div className="px-4 sm:px-6 md:px-8 mb-6">
          <div className="max-w-[1300px] mx-auto">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-navbar-bg/95 backdrop-blur-sm border-b border-charcoal/10">
              <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-4">
                <button
                  onClick={() => router.back()}
                  className="group flex items-center"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-charcoal/5 hover:border-sage/20 mr-3 sm:mr-4">
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal/70 group-hover:text-sage transition-colors duration-300" />
                  </div>
                  <h1 className="font-sf text-sm font-700 text-white transition-all duration-300 group-hover:text-white/80 relative">
                   Your Saved Gems
                  </h1>
                </button>
              </div>
            </div>

            
            {/* Saved Businesses */}
            {savedBusinesses.length > 0 ? (
              <ScrollReveal delay={0.3}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 list-none">
                  {savedBusinesses.map((business) => (
                    <div key={business.id} className="relative">
                      <BusinessCard business={business} />
                      {/* Saved indicator */}
                      <div className="absolute bottom-6 right-4 w-8 h-8 bg-coral rounded-full flex items-center justify-center shadow-lg">
                        <Bookmark className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            ) : (
              <ScrollReveal delay={0.3}>
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-sage/10 rounded-full flex items-center justify-center">
                    <Bookmark className="w-8 h-8 text-sage" />
                  </div>
                  <h3 className="font-sf text-5 font-600 text-charcoal mb-4">
                    No saved gems yet
                  </h3>
                  <p className="font-sf text-6 text-charcoal/70 mb-8 max-w-sm mx-auto">
                    Start exploring and save your favorite local businesses to see them here
                  </p>
                  <a
                    href="/home"
                    className="inline-flex items-center px-6 py-3 bg-sage text-white font-sf text-6 font-600 rounded-full hover:bg-sage/90 transition-all duration-300 shadow-lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Discover Gems
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
    </EmailVerificationGuard>
  );
}
