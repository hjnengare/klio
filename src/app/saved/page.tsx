"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { getBusinessesByIds } from "../data/businessDataOptimized";
import EmailVerificationGuard from "../components/Auth/EmailVerificationGuard";
import { useSavedItems } from "../contexts/SavedItemsContext";
import SavedHeader from "../components/Saved/SavedHeader";
import SavedBusinessRow from "../components/Saved/SavedBusinessRow";
import EmptySavedState from "../components/Saved/EmptySavedState";

const Footer = dynamic(() => import("../components/Footer/Footer"), {
  loading: () => null,
  ssr: false,
});

export default function SavedPage() {
  const { savedItems } = useSavedItems();

  // Optimized filtering using the optimized data structure
  const savedBusinesses = useMemo(() => {
    if (savedItems.length === 0) return [];
    return getBusinessesByIds(savedItems);
  }, [savedItems]);

  return (
    <EmailVerificationGuard>
      <div className="min-h-dvh bg-off-white">
        <SavedHeader />

        <div className="bg-gradient-to-b from-off-white/0 via-off-white/50 to-off-white">
          <div className="py-1 pt-20 pb-12 sm:pb-16 md:pb-20">
            {savedBusinesses.length > 0 ? (
              <div>
                <SavedBusinessRow
                  title="Your Saved Gems"
                  businesses={savedBusinesses}
                  showCount={true}
                />
              </div>
            ) : (
              <div className="pt-4">
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
