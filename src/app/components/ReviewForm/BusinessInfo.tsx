"use client";

import { Star } from "lucide-react";

interface BusinessInfoProps {
  businessName: string;
  businessRating: number;
}

export default function BusinessInfo({ businessName, businessRating }: BusinessInfoProps) {
  return (
    <div className="mb-4 md:mb-6 text-center px-4">
      <h2 className="text-xl md:text-lg font-700 text-charcoal mb-2">{businessName}</h2>
      <div className="flex items-center justify-center space-x-2">
        <div className="flex items-center space-x-1 bg-gradient-to-br from-amber-400 to-amber-600 px-3 py-1.5 rounded-full">
          <Star size={14} className="text-white" style={{ fill: "currentColor" }} />
          <span className="text-sm md:text-base font-700 text-white">
            {businessRating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
