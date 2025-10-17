"use client";

import dynamic from "next/dynamic";
import { Business } from "../BusinessCard/BusinessCard";

// Minimal loading component for BusinessRow
const BusinessRowSkeleton = () => (
  <section className="pb-4 sm:pb-6 sm:pt-2  bg-off-white   relative">
    <div className="container mx-auto max-w-[1300px] px-4 relative z-10">
      <div className="mb-6 sm:mb-12 flex items-center justify-between gap-4">
        <div className="h-6 bg-sage/10 rounded w-32" />
        <div className="h-4 bg-sage/10 rounded w-20" />
      </div>
      <div className="flex gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-shrink-0 w-[280px] h-[240px] bg-sage/5 rounded-lg" />
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
  return <BusinessRowDynamic {...props} businesses={props.businesses || []} />;
}