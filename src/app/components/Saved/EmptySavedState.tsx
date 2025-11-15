"use client";

import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmptySavedState() {
  const router = useRouter();

  return (
    <div
      className="mx-auto w-full max-w-[2000px] px-4 sm:px-6 lg:px-10 2xl:px-16"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 bg-sage/10 rounded-full flex items-center justify-center">
          <Bookmark className="w-8 h-8 text-sage" />
        </div>

        <h3 className="font-urbanist text-lg font-600 text-charcoal mb-2">
          No saved items yet
        </h3>

        <p className="font-urbanist text-sm text-charcoal/60 mb-6 max-w-md mx-auto">
          Tap the bookmark icon on any business to save it here
        </p>

        <button
          onClick={() => router.push("/home")}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-sage text-white font-urbanist text-sm font-600 rounded-full hover:bg-sage/90 transition-all duration-300"
        >
          Discover Businesses
        </button>
      </div>
    </div>
  );
}
