"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bookmark } from "lucide-react";
import { useSavedItems } from "../../contexts/SavedItemsContext";

export default function SavedHeader() {
  const router = useRouter();
  const { savedCount } = useSavedItems();

  return (
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
              Your Saved Gems
            </h1>
          </button>

          {savedCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sage/20 to-coral/20 rounded-full backdrop-blur-sm border border-sage/20">
              <Bookmark className="w-4 h-4 text-sage" />
              <span className="font-urbanist text-sm font-600 text-white">
                {savedCount} {savedCount === 1 ? 'Gem' : 'Gems'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
