// src/app/leaderboard/page.tsx
"use client";

import { useState, useMemo, memo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import EmailVerificationGuard from "../components/Auth/EmailVerificationGuard";
import LeaderboardHeader from "../components/Leaderboard/LeaderboardHeader";
import LeaderboardPodium from "../components/Leaderboard/LeaderboardPodium";
import LeaderboardList from "../components/Leaderboard/LeaderboardList";
import LeaderboardTitle from "../components/Leaderboard/LeaderboardTitle";
import BusinessOfMonthLeaderboard from "../components/Leaderboard/BusinessOfMonthLeaderboard";
import { Tabs } from "@/components/atoms/Tabs";
import { BUSINESSES_OF_THE_MONTH } from "../data/communityHighlightsData";

const Footer = dynamic(() => import("../components/Footer/Footer"), {
  loading: () => null,
  ssr: false,
});

interface LeaderboardUser {
  rank: number;
  username: string;
  reviews: number;
  badge?: string;
  avatar: string;
  totalRating: number;
}

// Memoized leaderboard data to prevent recreation on every render
const topReviewers: LeaderboardUser[] = [
  { rank: 1, username: "Observer", reviews: 25, badge: "🥇", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.9 },
  { rank: 2, username: "Ghost", reviews: 20, badge: "🥈", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.8 },
  { rank: 3, username: "Reviewer", reviews: 15, badge: "🥉", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.7 },
  { rank: 4, username: "LocalGuru", reviews: 12, avatar: "https://images.unsplash.com/photo-1494790108755-2616b332e234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.6 },
  { rank: 5, username: "TasteExplorer", reviews: 10, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.5 },
  { rank: 6, username: "CityScout", reviews: 8, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.4 },
  { rank: 7, username: "GemHunter", reviews: 7, avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.3 },
  { rank: 8, username: "ReviewMaster", reviews: 6, avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.2 },
  { rank: 9, username: "FoodieLife", reviews: 5, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.1 },
  { rank: 10, username: "UrbanExplorer", reviews: 5, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.0 },
  { rank: 11, username: "TrendSetter", reviews: 4, avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 3.9 },
  { rank: 12, username: "NightOwl", reviews: 4, avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 3.8 },
  { rank: 13, username: "VibeChecker", reviews: 3, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 3.7 },
  { rank: 14, username: "QualityFirst", reviews: 3, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 3.6 },
  { rank: 15, username: "StyleHunter", reviews: 2, avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 3.5 }
];

function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("contributors");
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);
  const [showFullBusinessLeaderboard, setShowFullBusinessLeaderboard] = useState(false);

  // Memoize the toggle functions to prevent unnecessary re-renders
  const handleToggleFullLeaderboard = useMemo(() =>
    () => setShowFullLeaderboard(!showFullLeaderboard),
    [showFullLeaderboard]
  );

  const handleToggleFullBusinessLeaderboard = useMemo(() =>
    () => setShowFullBusinessLeaderboard(!showFullBusinessLeaderboard),
    [showFullBusinessLeaderboard]
  );

  const tabs = [
    { id: "contributors", label: "Top Contributors" },
    { id: "businesses", label: "Top Businesses" },
  ];

  return (
    <EmailVerificationGuard>
      <div className="min-h-dvh bg-off-white">
        <LeaderboardHeader />

        <div className="bg-gradient-to-b from-off-white/0 via-off-white/50 to-off-white">
          <div className="py-1 pt-20">
            {/* Hero Section */}
            <section className="relative z-10 pb-6 sm:pb-8 md:pb-12">
              <div className="max-w-[1300px] mx-auto px-3 sm:px-4 md:px-6">
                {/* Breadcrumb */}
                <nav className="px-2 sm:px-4 pb-1" aria-label="Breadcrumb">
                  <ol className="flex items-center gap-1 text-sm text-charcoal/60">
                    <li>
                      <Link href="/home" className="hover:text-charcoal transition-colors font-urbanist">
                        Home
                      </Link>
                    </li>
                    <li className="text-charcoal/40">/</li>
                    <li className="text-charcoal font-medium font-urbanist">Community Highlights</li>
                  </ol>
                </nav>

               <LeaderboardTitle />
              </div>
            </section>

            {/* Main Content Section */}
            <section
              className="relative pb-12 sm:pb-16 md:pb-20"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
              }}
            >
              <div className="container mx-auto max-w-[1300px] px-3 sm:px-4 md:px-6 relative z-10">
                <div className="max-w-[800px] mx-auto pt-4 sm:pt-6 md:pt-8">

                  {/* Tabs */}
                  <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 px-2">
                    <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                  </div>

                  {/* Leaderboard Content */}
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 rounded-xl ring-1 ring-white/20 p-3 sm:p-4 md:p-6 lg:p-8 mb-6 sm:mb-8 md:mb-12 relative overflow-hidden"
                  >
                    {/* Card decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-lg"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-coral/10 to-transparent rounded-full blur-lg"></div>

                    <div className="relative z-10">
                      {activeTab === "contributors" ? (
                        <>
                          <LeaderboardPodium topReviewers={topReviewers} />
                          <LeaderboardList
                            users={topReviewers}
                            showFullLeaderboard={showFullLeaderboard}
                            onToggleFullLeaderboard={handleToggleFullLeaderboard}
                          />
                        </>
                      ) : (
                        <BusinessOfMonthLeaderboard
                          businesses={BUSINESSES_OF_THE_MONTH}
                          showFullLeaderboard={showFullBusinessLeaderboard}
                          onToggleFullLeaderboard={handleToggleFullBusinessLeaderboard}
                        />
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          </div>

          <Footer />
        </div>
      </div>
    </EmailVerificationGuard>
  );
}

export default memo(LeaderboardPage);
