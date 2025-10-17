"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import EmailVerificationGuard from "../components/Auth/EmailVerificationGuard";

export default function WriteReviewPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Preload common ion-icons
    ["search", "business", "location", "star", "chevron-forward", "chevron-back"].forEach((n) => {
      const el = document.createElement("ion-icon");
      el.name = n;
      el.style.display = "none";
      document.body.appendChild(el);
      setTimeout(() => document.body.contains(el) && document.body.removeChild(el), 100);
    });
  }, []);

  const mockBusinesses = [
    {
      id: 1,
      name: "Blue Bottle Coffee",
      category: "Coffee Shop",
      location: "Downtown",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop&auto=format"
    },
    {
      id: 2,
      name: "The French Laundry",
      category: "Fine Dining",
      location: "Napa Valley",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop&auto=format"
    },
    {
      id: 3,
      name: "Yoga Flow Studio",
      category: "Fitness",
      location: "Mission District",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&auto=format"
    },
    {
      id: 4,
      name: "Local Bookstore",
      category: "Retail",
      location: "Castro",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop&auto=format"
    }
  ];

  const filteredBusinesses = mockBusinesses.filter(business =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <EmailVerificationGuard>
      <div className="min-h-screen  bg-off-white   relative overflow-hidden">
      {/* Static background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-transparent to-coral/5" />
      </div>

      {/* Header */}
      <div className="relative z-20  bg-off-white   backdrop-blur-sm border-b border-sage/10 sticky top-0">
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
                Write Review
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-[800px] mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="font-sf text-xl font-600 text-charcoal mb-2">
              Which business would you like to review?
            </h2>
            <p className="text-charcoal/60 text-sm">
              Search for a business or select from your recent visits
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <ion-icon name="search" class="text-charcoal/40 text-base" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search businesses..."
              className="w-full pl-12 pr-4 py-4  bg-off-white   border border-sage/10 rounded-xl
                         font-sf text-base placeholder:text-charcoal/40
                         focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage/50
                         transition-all duration-200"
            />
          </div>
        </div>

        {/* Business Results */}
        <div className="space-y-3">
          {filteredBusinesses.map((business) => (
            <Link
              key={business.id}
              href="/business/review"
              className="block p-4  bg-off-white   border border-sage/10 rounded-xl hover:border-sage/30
                         transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Business Image or Placeholder */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-sage/10 group-hover:bg-sage/20 transition-colors duration-200">
                    {business.image && !imageErrors[business.id] ? (
                      <Image
                        src={business.image}
                        alt={business.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        onError={() => setImageErrors(prev => ({ ...prev, [business.id]: true }))}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ion-icon name="business" class="text-sage text-lg" />
                      </div>
                    )}
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
                    </div>
                  </div>
                </div>
                <ion-icon name="chevron-forward" class="text-charcoal/40 text-base
                                                         group-hover:text-sage transition-colors duration-200" />
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {searchQuery && filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <ion-icon name="search" class="text-2xl text-charcoal/40" />
            </div>
            <h3 className="font-sf text-lg font-600 text-charcoal mb-2">
              No businesses found
            </h3>
            <p className="text-charcoal/60 text-sm mb-6">
              Can&apos;t find the business you&apos;re looking for? Try a different search term.
            </p>
            <button className="px-6 py-3 bg-sage text-white rounded-lg font-sf text-sm font-500
                               hover:bg-sage/90 transition-colors duration-200">
              Suggest a Business
            </button>
          </div>
        )}
      </div>
      </div>
    </EmailVerificationGuard>
  );
}