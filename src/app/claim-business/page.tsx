"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Store,
  MapPin,
  Check,
  ArrowLeft,
} from "lucide-react";

const Footer = dynamic(() => import("../components/Footer/Footer"), {
  loading: () => null,
  ssr: false,
});

export default function ClaimBusinessPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null);

  const unclaimedBusinesses = [
    { id: 1, name: "Artisan Bakery & Café", category: "Bakery", location: "Mission District", reviews: 45 },
    { id: 2, name: "Vintage Vinyl Records", category: "Music Store", location: "Castro", reviews: 23 },
    { id: 3, name: "Mountain View Fitness", category: "Gym", location: "SOMA", reviews: 67 },
    { id: 4, name: "Garden Fresh Market", category: "Grocery", location: "Richmond", reviews: 34 },
    { id: 5, name: "Sunset Yoga Studio", category: "Wellness", location: "Sunset", reviews: 89 },
  ];

  const filteredBusinesses = unclaimedBusinesses.filter((business) =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClaimBusiness = (businessId: number) => {
    setSelectedBusiness(businessId);
    console.log(`Claiming business with ID: ${businessId}`);
  };

  return (
    <div className="min-h-dvh bg-off-white">
      {/* Header */}
      <div
        className="fixed top-0 left-0 right-0 z-50 bg-navbar-bg/95 backdrop-blur-sm border-b border-charcoal/10"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
        }}
      >
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="group flex items-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-charcoal/5 hover:border-sage/20 mr-3 sm:mr-4">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-sage transition-colors duration-300" />
              </div>
              <h1 className="font-urbanist text-sm font-700 text-white transition-all duration-300 group-hover:text-white/80 relative">
                Claim Your Business
              </h1>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-off-white/0 via-off-white/50 to-off-white">
        <div className="py-1 pt-20">
          {/* Main Content Section */}
          <section
            className="relative pb-12 sm:pb-16 md:pb-20"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
            }}
          >
            <div className="container mx-auto max-w-[1300px] px-4 sm:px-6 relative z-10">
              <div className="max-w-[800px] mx-auto pt-8">
                {/* Header Section */}
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-white/30">
                    <Store className="w-7 h-7 text-charcoal" />
                  </div>
                  <h2 className="font-urbanist text-xl font-600 text-charcoal mb-2">
                    Own or manage a business?
                  </h2>
                  <p className="font-urbanist text-charcoal/70 text-sm max-w-md mx-auto">
                    Claim your business profile to respond to reviews, update information, and connect with customers
                  </p>
                </div>

                {/* Search Section */}
                <div className="mb-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="w-4 h-4 text-charcoal/60" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for your business..."
                      className="w-full pl-12 pr-4 py-3.5 bg-white/80 backdrop-blur-sm border-2 border-charcoal/20 rounded-xl
                                 text-sm placeholder:text-charcoal/50 font-urbanist text-charcoal
                                 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20
                                 hover:border-charcoal/30 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Business Results */}
                <div className="space-y-3 mb-8">
                  {filteredBusinesses.map((business) => (
                    <div
                      key={business.id}
                      className="p-4 bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 rounded-xl ring-1 ring-white/20
                                 hover:border-white/70 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0
                                          group-hover:bg-white/40 transition-colors duration-200 shadow-sm">
                            <Store className="w-5 h-5 text-charcoal" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-urbanist text-sm font-600 text-charcoal
                                           transition-colors duration-200 truncate">
                              {business.name}
                            </h3>
                            <div className="flex items-center flex-wrap gap-2 mt-1 font-urbanist text-xs text-charcoal/70">
                              <span>{business.category}</span>
                              <span className="text-charcoal/40">•</span>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-charcoal/60" />
                                <span>{business.location}</span>
                              </div>
                              <span className="text-charcoal/40">•</span>
                              <span>{business.reviews} reviews</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleClaimBusiness(business.id)}
                          disabled={selectedBusiness === business.id}
                          className={`px-4 py-2 rounded-full text-xs font-600 font-urbanist transition-all duration-200 flex-shrink-0
                            ${selectedBusiness === business.id
                              ? "bg-charcoal text-white shadow-lg"
                              : "bg-white/40 text-charcoal hover:bg-charcoal hover:text-white hover:shadow-lg"
                            }`}
                        >
                          {selectedBusiness === business.id ? (
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4" />
                              <span>Claimed</span>
                            </div>
                          ) : (
                            "Claim"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {searchQuery && filteredBusinesses.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Search className="w-6 h-6 text-charcoal" />
                    </div>
                    <h3 className="font-urbanist text-base font-600 text-charcoal mb-2">
                      Business not found
                    </h3>
                    <p className="font-urbanist text-charcoal/70 text-sm mb-6">
                      Can't find your business? You can add it to our directory.
                    </p>
                    <button className="px-6 py-2.5 bg-charcoal text-white rounded-full text-sm font-600 font-urbanist
                                       hover:bg-charcoal/90 transition-all duration-300 hover:shadow-lg">
                      Add Your Business
                    </button>
                  </div>
                )}

                {/* Help Section */}
                <div className="mt-12 mb-12 p-6 bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 rounded-xl ring-1 ring-white/20">
                  <h3 className="font-urbanist text-base font-600 text-charcoal mb-2">
                    Need help claiming your business?
                  </h3>
                  <p className="font-urbanist text-charcoal/70 text-sm mb-4">
                    Our business verification process is quick and easy. You'll need to provide proof of ownership
                    or management authorisation.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-white/40 text-charcoal rounded-full text-sm font-600 font-urbanist
                                       hover:bg-charcoal hover:text-white transition-all duration-300 shadow-sm">
                      Contact Support
                    </button>
                    <button className="px-8 py-2.5 bg-gradient-to-r from-coral to-coral/90 text-white text-sm font-700 font-urbanist rounded-full hover:from-coral/90 hover:to-coral/80 transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </div>
  );
}
