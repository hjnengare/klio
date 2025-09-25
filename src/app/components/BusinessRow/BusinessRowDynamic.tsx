"use client";

import dynamic from "next/dynamic";
import { Business } from "../BusinessCard/BusinessCard";

// Optimized loading component for BusinessRow
const BusinessRowSkeleton = () => (
  <section
    className="pb-8 sm:pb-12 sm:pt-4 bg-gradient-to-b from-off-white to-off-white/95 relative"
    aria-label="businesses loading"
  >
    <div className="container mx-auto max-w-[1300px] relative z-10 px-4 md:px-6 lg:px-8">
      <div className="mb-6 sm:mb-10 flex flex-wrap items-center justify-between gap-6">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
      </div>

      <div className="flex gap-6 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-shrink-0 w-[280px]">
            <div className="rounded-2xl overflow-hidden bg-white ring-1 ring-black/[0.04] shadow-sm">
              <div className="w-full aspect-[4/3] bg-gray-200 animate-pulse" />
              <div className="p-4 min-h-[140px]">
                <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Dynamic import with better loading state
const BusinessRowDynamic = dynamic(
  () => import("./BusinessRow"),
  {
    ssr: false, // Disable SSR for better performance with animations
    loading: () => <BusinessRowSkeleton />,
  }
);

// Props interface
interface BusinessRowDynamicProps {
  title: string;
  businesses?: Business[];
  loading?: boolean;
  error?: string | null;
  cta?: string;
  href?: string;
}

// Wrapper component with error boundary
export default function BusinessRowDynamicWrapper(props: BusinessRowDynamicProps) {
  return <BusinessRowDynamic {...props} />;
}