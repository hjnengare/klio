"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ClaimBusinessPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null);

  useEffect(() => {
    // Preload common ion-icons
    ["search", "storefront", "location", "star", "chevron-forward", "chevron-back", "checkmark"].forEach((n) => {
      const el = document.createElement("ion-icon");
      el.name = n;
      el.style.display = "none";
      document.body.appendChild(el);
      setTimeout(() => document.body.contains(el) && document.body.removeChild(el), 100);
    });
  }, []);

  const unclaimedBusinesses = [
    { id: 1, name: "Artisan Bakery & Café", category: "Bakery", location: "Mission District", reviews: 45 },
    { id: 2, name: "Vintage Vinyl Records", category: "Music Store", location: "Castro", reviews: 23 },
    { id: 3, name: "Mountain View Fitness", category: "Gym", location: "SOMA", reviews: 67 },
    { id: 4, name: "Garden Fresh Market", category: "Grocery", location: "Richmond", reviews: 34 },
    { id: 5, name: "Sunset Yoga Studio", category: "Wellness", location: "Sunset", reviews: 89 }
  ];

  const filteredBusinesses = unclaimedBusinesses.filter(business =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClaimBusiness = (businessId: number) => {
    setSelectedBusiness(businessId);
    // Here you would typically redirect to a claim form or verification process
    console.log(`Claiming business with ID: ${businessId}`);
  };

  return (
    <div className="min-h-screen bg-white  /90">
      {/* Header */}
      <div className="bg-white  /90/95 backdrop-blur-sm border-b border-charcoal/10 sticky top-0 z-10">
        <div className="max-w-[1300px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full hover:bg-sage/5 flex items-center justify-center transition-all duration-200 mobile-interaction"
                aria-label="Go back"
              >
                <ion-icon name="chevron-back" class="text-lg text-charcoal/70" />
              </button>
              <h1 className="font-sf text-2xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal">
                Claim Your Business
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-8">
        {/* Info Section */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ion-icon name="storefront" class="text-2xl text-sage" />
          </div>
          <h2 className="font-sf text-xl font-600 text-charcoal mb-2">
            Own or manage a business?
          </h2>
          <p className="text-charcoal/60 text-sm max-w-md mx-auto">
            Claim your business profile to respond to reviews, update information, and connect with customers
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <ion-icon name="search" class="text-charcoal/40 text-base" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for your business..."
              className="w-full pl-12 pr-4 py-4 bg-white   border border-charcoal/10 rounded-xl
                         font-sf text-base placeholder:text-charcoal/40
                         focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage/50
                         transition-all duration-200"
            />
          </div>
        </div>

        {/* Business Results */}
        <div className="space-y-3 mb-8">
          {filteredBusinesses.map((business) => (
            <div
              key={business.id}
              className="p-4 bg-white   border border-charcoal/5 rounded-xl hover:bg-sage/5
                         hover:border-sage/20 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-coral/10 rounded-full flex items-center justify-center
                                  group-hover:bg-coral/20 transition-colors duration-200">
                    <ion-icon name="storefront" class="text-coral text-lg" />
                  </div>
                  <div>
                    <h3 className="font-sf text-base font-600 text-charcoal group-hover:text-sage
                                   transition-colors duration-200">
                      {business.name}
                    </h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm text-charcoal/60">{business.category}</span>
                      <span className="text-charcoal/30">•</span>
                      <div className="flex items-center space-x-1">
                        <ion-icon name="location" class="text-xs text-charcoal/40" />
                        <span className="text-sm text-charcoal/60">{business.location}</span>
                      </div>
                      <span className="text-charcoal/30">•</span>
                      <span className="text-sm text-charcoal/60">{business.reviews} reviews</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleClaimBusiness(business.id)}
                  disabled={selectedBusiness === business.id}
                  className={`px-4 py-2 rounded-lg font-sf text-sm font-500 transition-all duration-200
                    ${selectedBusiness === business.id
                      ? 'bg-sage text-white'
                      : 'bg-sage/10 text-sage hover:bg-sage hover:text-white'
                    }`}
                >
                  {selectedBusiness === business.id ? (
                    <div className="flex items-center space-x-2">
                      <ion-icon name="checkmark" class="text-sm" />
                      <span>Claimed</span>
                    </div>
                  ) : (
                    'Claim This Business'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {searchQuery && filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <ion-icon name="search" class="text-2xl text-charcoal/40" />
            </div>
            <h3 className="font-sf text-lg font-600 text-charcoal mb-2">
              Business not found
            </h3>
            <p className="text-charcoal/60 text-sm mb-6">
              Can't find your business? You can add it to our directory.
            </p>
            <button className="px-6 py-3 bg-coral text-white rounded-lg font-sf text-sm font-500
                               hover:bg-coral/90 transition-colors duration-200">
              Add Your Business
            </button>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 p-6 bg-white   border border-charcoal/5 rounded-xl">
          <h3 className="font-sf text-lg font-600 text-charcoal mb-3">
            Need help claiming your business?
          </h3>
          <p className="text-charcoal/60 text-sm mb-4">
            Our business verification process is quick and easy. You'll need to provide proof of ownership
            or management authorization.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-sage/10 text-sage rounded-lg font-sf text-sm font-500
                               hover:bg-sage hover:text-white transition-colors duration-200">
              Contact Support
            </button>
            <button className="px-4 py-2 border border-charcoal/10 text-charcoal rounded-lg font-sf text-sm font-500
                               hover:bg-charcoal/5 transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}