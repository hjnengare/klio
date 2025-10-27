import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Edit3, Store } from "lucide-react";

export interface Business {
  id: string;
  name: string;
  category: string;
  status: "active" | "pending" | "inactive";
  rating: number;
  reviews: number;
  image: string;
  lastUpdated: string;
  pendingReviews: number;
  verificationStatus: "verified" | "pending" | "rejected";
}

interface BusinessListCardProps {
  businesses: Business[];
}

export function BusinessListCard({ businesses }: BusinessListCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "inactive": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified": return "text-sage bg-sage/10";
      case "pending": return "text-coral bg-coral/10";
      case "rejected": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 rounded-xl ring-1 ring-white/20 p-6 relative overflow-hidden animate-fade-in-up animate-delay-300">
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-lg" />
      <div className="relative z-10">
        <h3 className="font-urbanist text-base font-600 text-charcoal mb-6 flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-sage/20 to-sage/10">
            <Store className="w-4 h-4 text-sage" />
          </span>
          Your Businesses
        </h3>

        <div className="space-y-4">
          {businesses.map((business) => (
            <div key={business.id} className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/50 hover:bg-white/60 transition-all duration-200">
              <div className="flex items-center gap-4">
                {/* Business Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/20 flex-shrink-0">
                  <Image
                    src={business.image}
                    alt={business.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Business Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-urbanist font-600 text-charcoal truncate">{business.name}</h4>
                    <span className={`font-urbanist px-2 py-1 rounded-full text-xs font-600 ${getStatusColor(business.status)}`}>
                      {business.status}
                    </span>
                    <span className={`font-urbanist px-2 py-1 rounded-full text-xs font-600 ${getVerificationColor(business.verificationStatus)}`}>
                      {business.verificationStatus}
                    </span>
                  </div>
                  <p className="font-urbanist text-sm text-charcoal/70 mb-1">{business.category}</p>
                  <div className="flex items-center gap-4 font-urbanist text-xs text-charcoal/60">
                    <span>{business.reviews} reviews</span>
                    {business.rating > 0 && <span>⭐ {business.rating}</span>}
                    <span>Updated {business.lastUpdated}</span>
                    {business.pendingReviews > 0 && (
                      <span className="text-coral font-600">{business.pendingReviews} pending reviews</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/business/${business.id}`}
                    className="w-8 h-8 bg-white/60 hover:bg-white/80 rounded-full flex items-center justify-center transition-all duration-200"
                    title="View Business"
                  >
                    <Eye className="w-4 h-4 text-charcoal" />
                  </Link>
                  <Link
                    href={`/business/${business.id}/edit`}
                    className="w-8 h-8 bg-sage/20 hover:bg-sage/30 rounded-full flex items-center justify-center transition-all duration-200"
                    title="Edit Business"
                  >
                    <Edit3 className="w-4 h-4 text-sage" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {businesses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-sage" />
            </div>
            <h4 className="font-urbanist font-600 text-charcoal mb-2">No businesses yet</h4>
            <p className="font-urbanist text-charcoal/70 text-sm mb-6">Start by claiming your first business or adding a new one.</p>
            <Link
              href="/claim-business"
              className="bg-sage hover:bg-sage/90 text-white px-6 py-3 rounded-full text-sm font-600 font-urbanist transition-all duration-300 flex items-center gap-2 mx-auto w-fit"
            >
              <Store className="w-4 h-4" />
              Add Your First Business
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
