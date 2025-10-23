"use client";

import { Star } from "lucide-react";

interface RatingSelectorProps {
  overallRating: number;
  onRatingChange: (rating: number) => void;
}

export default function RatingSelector({ overallRating, onRatingChange }: RatingSelectorProps) {
  return (
    <div className="mb-6 md:mb-8 px-4">
      <h3 className="text-base md:text-xl font-600 text-charcoal mb-3 md:mb-4 text-center md:text-left">
        Overall rating
      </h3>
      <div className="flex items-center justify-center space-x-1 md:space-x-2 mb-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= overallRating;
          return (
            <button
              key={star}
              onClick={() => onRatingChange(star)}
              className="p-1 md:p-2 focus:outline-none transition-all duration-300 rounded-full hover:bg-amber-50"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                size={32}
                className={active ? "text-amber-500" : "text-gray-400"}
                style={{ fill: active ? "currentColor" : "none" }}
              />
            </button>
          );
        })}
      </div>
      <p className="text-center text-sm font-400 text-charcoal/60">Tap to select rating</p>
    </div>
  );
}
