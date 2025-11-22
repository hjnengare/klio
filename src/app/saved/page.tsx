"use client";

import nextDynamic from "next/dynamic";
import { useMemo } from "react";
// Removed mock data import - use API calls instead
import EmailVerificationGuard from "../components/Auth/EmailVerificationGuard";
import { useSavedItems } from "../contexts/SavedItemsContext";
import SavedHeader from "../components/Saved/SavedHeader";
import SavedBusinessRow from "../components/Saved/SavedBusinessRow";
import EmptySavedState from "../components/Saved/EmptySavedState";

// Note: dynamic and revalidate cannot be exported from client components
// Client components are automatically dynamic

const Footer = nextDynamic(() => import("../components/Footer/Footer"), {
  loading: () => null,
  ssr: false,
});

export default function SavedPage() {
  const { savedItems } = useSavedItems();

  // TODO: Implement API call to fetch businesses by IDs
  const savedBusinesses = useMemo(() => {
    // TODO: Replace with actual API call to fetch businesses by IDs
    // Example: const businesses = await fetch(`/api/businesses?ids=${savedItems.join(',')}`);
    return [];
  }, [savedItems]);

  return (
    <EmailVerificationGuard>
      <div 
        className="min-h-dvh bg-off-white relative font-urbanist"
        style={{
          fontFamily: '"Urbanist", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        }}
      >
        <SavedHeader />

        <div className="relative z-0">
          <div className="py-1 pt-20 pb-12 sm:pb-16 md:pb-20">
            {savedBusinesses.length > 0 ? (
              <div className="relative z-10">
                <SavedBusinessRow
                  title="Your Saved Gems"
                  businesses={savedBusinesses}
                  showCount={true}
                />
              </div>
            ) : (
              <div className="pt-4 relative z-10">
                <EmptySavedState />
              </div>
            )}
          </div>

          <Footer />
        </div>
      </div>
    </EmailVerificationGuard>
  );
}
