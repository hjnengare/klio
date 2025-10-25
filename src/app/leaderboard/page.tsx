// src/app/leaderboard/page.tsx
"use client";

import { useState, useMemo, memo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import EmailVerificationGuard from "../components/Auth/EmailVerificationGuard";
import LeaderboardHeader from "../components/Leaderboard/LeaderboardHeader";
import LeaderboardTitle from "../components/Leaderboard/LeaderboardTitle";
import LeaderboardPodium from "../components/Leaderboard/LeaderboardPodium";
import LeaderboardList from "../components/Leaderboard/LeaderboardList";

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
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);

  // Memoize the toggle function to prevent unnecessary re-renders
  const handleToggleFullLeaderboard = useMemo(() =>
    () => setShowFullLeaderboard(!showFullLeaderboard),
    [showFullLeaderboard]
  );

  return (
    <EmailVerificationGuard>
      <div className="min-h-dvh bg-off-white">
        <LeaderboardHeader />

        <div className="bg-gradient-to-b from-off-white/0 via-off-white/50 to-off-white">
          <div className="py-1 pt-20">
            {/* Main Content Section */}
            <section
              className="relative"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
              }}
            >
              <div className="container mx-auto max-w-[1300px] px-4 sm:px-6 relative z-10">
                <div className="max-w-[800px] mx-auto pt-8">
                  <LeaderboardTitle />

                  {/* Top Reviewers Leaderboard */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 rounded-xl ring-1 ring-white/20 p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 relative overflow-hidden"
                  >
                    {/* Card decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-lg"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-coral/10 to-transparent rounded-full blur-lg"></div>

                    <div className="relative z-10">
                      <LeaderboardPodium topReviewers={topReviewers} />
                      <LeaderboardList
                        users={topReviewers}
                        showFullLeaderboard={showFullLeaderboard}
                        onToggleFullLeaderboard={handleToggleFullLeaderboard}
                      />
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
