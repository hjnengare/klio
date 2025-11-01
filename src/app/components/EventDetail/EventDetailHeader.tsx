// src/components/EventDetail/EventDetailHeader.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Share2, Bookmark } from "lucide-react";

interface EventDetailHeaderProps {
  isBookmarked: boolean;
  onBookmark: () => void;
  onShare: () => void;
}

export default function EventDetailHeader({
  isBookmarked,
  onBookmark,
  onShare,
}: EventDetailHeaderProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-navbar-bg/95 backdrop-blur-sm border-b border-charcoal/10"
    >
      <div className="max-w-[1300px] mx-auto px-4">
        <div className="h-10 sm:h-11 flex items-center justify-between">
          <Link href="/events-specials" className="group flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-charcoal/5 hover:border-sage/20 mr-2 sm:mr-3">
              <ArrowLeft className="w-4 h-4 text-white group-hover:text-sage transition-colors duration-300" />
            </div>
            <span className="font-urbanist text-[10px] sm:text-xs font-medium text-white transition-all duration-300 group-hover:text-white/80" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
              Back to Events
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={onShare}
              className="w-10 h-10 bg-gradient-to-br from-sage/10 to-sage/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-sage/5 hover:border-sage/20"
              aria-label="Share event"
            >
              <Share2 className="text-white" size={18} />
            </button>
            <button
              onClick={onBookmark}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border ${
                isBookmarked
                  ? "bg-coral text-white border-coral"
                  : "bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-coral/20 hover:to-coral/10 border-charcoal/5 hover:border-coral/20"
              }`}
              aria-label="Bookmark event"
            >
              <Bookmark className="text-white" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
