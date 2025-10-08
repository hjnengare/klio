// src/app/leaderboard/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import FallbackImage from "../components/FallbackImage/FallbackImage";

// 🔁 Replaced Ionicons with lucide-react
import {
  ArrowLeft,
  Trophy,
  Star,
  Medal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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

export default function LeaderboardPage() {
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);
  const [showToast, setShowToast] = useState(true);

  return (
    <div className="min-h-dvh  bg-white   pb-6 relative overflow-hidden">

      {/* Premium background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-sage/8 via-sage/4 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-coral/6 via-coral/3 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-charcoal/3 via-charcoal/1 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className=" bg-white  /80 backdrop-blur-xl border-b border-charcoal/10 px-3 sm:px-4 py-4 sm:py-6 shadow-sm relative z-10"
      >
        <div className="flex items-center justify-between max-w-[1300px] mx-auto">
          {/* Back button */}
          <Link href="/home" className="group flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-charcoal/5 hover:border-sage/20 mr-2 sm:mr-4">
              <ArrowLeft className="text-lg sm:text-xl text-charcoal/70 group-hover:text-sage transition-colors duration-300" />
            </div>
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-sf text-base sm:text-xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal transition-all duration-300 group-hover:from-sage/90 group-hover:to-sage relative"
            >
              Community Highlights
            </motion.h1>
          </Link>
        </div>
      </motion.header>

      <div className="max-w-[1300px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 relative z-10">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="font-sf text-lg sm:text-xl md:text-2xl font-700 text-charcoal mb-2 sm:mb-4 px-4">
            Top Contributors This Month
          </h2>
          <p className="font-sf text-sm sm:text-base font-400 text-charcoal/70 max-w-2xl mx-auto px-4">
            Celebrating our community&apos;s most valued reviewers and featured businesses
          </p>
        </motion.div>

        {/* Top Reviewers Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className=" bg-white   backdrop-blur-xl shadow-xl border border-charcoal/10 p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 relative overflow-hidden rounded-2xl"
        >
          {/* Card decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-coral/10 to-transparent rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <h3 className="font-sf text-base sm:text-lg font-700 text-charcoal mb-6 sm:mb-8 text-center flex items-center justify-center gap-2 sm:gap-3">
              <Trophy className="text-base sm:text-lg text-sage" />
              Top Reviewers
            </h3>

            {/* Top 3 Podium - Professional */}
            <div className="flex flex-col sm:flex-row justify-center items-end gap-4 sm:gap-4 mb-6 sm:mb-8 md:mb-12 px-2 max-w-3xl mx-auto">
              {/* 2nd Place */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-center group cursor-pointer flex-1 w-full sm:max-w-[180px]"
              >
                <div className="relative mb-2 sm:mb-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative rounded-full overflow-hidden border-3 sm:border-4 border-white shadow-xl mx-auto ring-3 sm:ring-4 ring-coral/30">
                    <FallbackImage
                      src={topReviewers[1].avatar}
                      alt={topReviewers[1].username}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                      fallbackType="profile"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-coral to-coral/80 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <span className="text-sm sm:text-lg font-bold text-white">2</span>
                  </div>
                </div>
                <div className="font-sf text-xs sm:text-sm md:text-base font-700 text-charcoal mb-1 group-hover:text-coral transition-colors duration-300 truncate px-2">@{topReviewers[1].username}</div>
                <div className="font-sf text-xs sm:text-sm text-charcoal/60 mb-2">
                  <span className="font-700 text-charcoal">{topReviewers[1].reviews}</span> reviews
                </div>
                <div className="bg-white   backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md border border-coral/20 flex items-center justify-center gap-1 sm:gap-1.5 mx-auto w-fit mb-2 sm:mb-3">
                  <Star className="text-sm text-coral" />
                  <span className="font-sf text-sm font-700 text-charcoal">{topReviewers[1].totalRating}</span>
                </div>
                {/* Professional Podium Block */}
                <div className="relative mt-auto">
                  <div className="bg-gradient-to-b from-coral/25 to-coral/15 rounded-t-xl h-20 sm:h-28 md:h-32 w-full shadow-xl border-coral relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  </div>
                </div>
              </motion.div>

              {/* 1st Place */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-center group cursor-pointer flex-1 w-full sm:max-w-[200px] order-first sm:order-none"
              >
                <div className="relative mb-2 sm:mb-3">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 relative rounded-full overflow-hidden border-3 sm:border-4 border-white shadow-2xl mx-auto ring-3 sm:ring-4 ring-sage">
                    <FallbackImage
                      src={topReviewers[0].avatar}
                      alt={topReviewers[0].username}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 128px"
                      fallbackType="profile"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                    <Trophy className="text-xl sm:text-2xl text-white" />
                  </div>
                </div>
                <div className="font-sf text-sm sm:text-base md:text-xl font-700 text-charcoal mb-1 group-hover:text-sage transition-colors duration-300 truncate px-2">@{topReviewers[0].username}</div>
                <div className="font-sf text-xs sm:text-sm text-charcoal/60 mb-2">
                  <span className="font-700 text-charcoal">{topReviewers[0].reviews}</span> reviews
                </div>
                <div className="bg-white   backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md border border-sage/30 flex items-center justify-center gap-1 sm:gap-1.5 mx-auto w-fit mb-3 sm:mb-4">
                  <Star className="text-base text-sage" />
                  <span className="font-sf text-base font-700 text-charcoal">{topReviewers[0].totalRating}</span>
                </div>
                {/* Professional Podium Block */}
                <div className="relative mt-auto">
                  <div className="bg-gradient-to-b from-sage/35 to-sage/20 rounded-t-xl h-24 sm:h-36 md:h-48 w-full shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  </div>
                </div>
              </motion.div>

              {/* 3rd Place */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-center group cursor-pointer flex-1 w-full sm:max-w-[180px]"
              >
                <div className="relative mb-2 sm:mb-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative rounded-full overflow-hidden border-3 sm:border-4 border-white shadow-xl mx-auto ring-3 sm:ring-4 ring-charcoal/20">
                    <FallbackImage
                      src={topReviewers[2].avatar}
                      alt={topReviewers[2].username}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                      fallbackType="profile"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-charcoal/70 to-charcoal/50 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <span className="text-sm sm:text-lg font-bold text-white">3</span>
                  </div>
                </div>
                <div className="font-sf text-xs sm:text-sm md:text-base font-700 text-charcoal mb-1 group-hover:text-charcoal/80 transition-colors duration-300 truncate px-2">@{topReviewers[2].username}</div>
                <div className="font-sf text-xs sm:text-sm text-charcoal/60 mb-2">
                  <span className="font-700 text-charcoal">{topReviewers[2].reviews}</span> reviews
                </div>
                <div className="bg-white   backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md border border-charcoal/20 flex items-center justify-center gap-1 sm:gap-1.5 mx-auto w-fit mb-2 sm:mb-3">
                  <Star className="text-sm text-charcoal/70" />
                  <span className="font-sf text-sm font-700 text-charcoal">{topReviewers[2].totalRating}</span>
                </div>
                {/* Professional Podium Block */}
                <div className="relative mt-auto">
                  <div className="bg-gradient-to-b from-charcoal/20 to-charcoal/10 rounded-t-xl h-16 sm:h-24 md:h-28 w-full shadow-xl border-charcoal/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Rest of Rankings */}
            <div className="space-y-2 sm:space-y-3">
              {topReviewers.slice(3, showFullLeaderboard ? undefined : 8).map((user, index) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  className="group  bg-white   rounded-lg sm:rounded-xl overflow-hidden shadow-sm cursor-pointer border border-charcoal/10"
                >
                  <div className="flex items-center justify-between p-3 sm:p-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-charcoal/10 to-charcoal/5 rounded-full flex items-center justify-center font-sf text-xs sm:text-sm font-600 text-charcoal/70 shadow-sm flex-shrink-0">
                        {user.rank}
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 relative rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                        <FallbackImage
                          src={user.avatar}
                          alt={user.username}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 40px, 48px"
                          fallbackType="profile"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-sf text-sm sm:text-base font-600 text-charcoal group-hover:text-sage transition-colors duration-300 truncate">@{user.username}</div>
                        <div className="font-sf text-xs sm:text-sm text-charcoal/60"><span className="font-700">{user.reviews}</span> <span className="font-400">reviews</span></div>
                      </div>
                    </div>
                    <div className="bg-white  /50 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full shadow-sm border border-white/30 flex items-center gap-1 flex-shrink-0">
                      <Star className="text-sm text-coral" />
                      <span className="font-sf text-sm font-600 text-charcoal">{user.totalRating}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              <AnimatePresence>
                {showFullLeaderboard && topReviewers.slice(8).map((user, index) => (
                  <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group  bg-white   rounded-lg sm:rounded-xl overflow-hidden shadow-sm cursor-pointer border border-charcoal/10"
                  >
                    <div className="flex items-center justify-between p-3 sm:p-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-charcoal/10 to-charcoal/5 rounded-full flex items-center justify-center font-sf text-xs sm:text-sm font-600 text-charcoal/70 shadow-sm flex-shrink-0">
                          {user.rank}
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 relative rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                          <FallbackImage
                            src={user.avatar}
                            alt={user.username}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 40px, 48px"
                            fallbackType="profile"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-sf text-sm sm:text-base font-600 text-charcoal group-hover:text-sage transition-colors duration-300 truncate">@{user.username}</div>
                          <div className="font-sf text-xs sm:text-sm text-charcoal/60"><span className="font-700">{user.reviews}</span> <span className="font-400">reviews</span></div>
                        </div>
                      </div>
                      <div className="bg-white  /50 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full shadow-sm border border-white/30 flex items-center gap-1 flex-shrink-0">
                        <Star className="text-sm text-coral" />
                        <span className="font-sf text-sm font-600 text-charcoal">{user.totalRating}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="text-center mt-6 sm:mt-8">
              <button
                onClick={() => setShowFullLeaderboard(!showFullLeaderboard)}
                className="font-sf text-sm sm:text-base font-600 text-sage hover:text-sage/80 transition-all duration-300 px-4 sm:px-6 py-2 hover:bg-sage/5 rounded-full flex items-center gap-2 mx-auto"
              >
                {showFullLeaderboard ? (
                  <>
                    <ChevronUp className="text-base" />
                    Show Less
                  </>
                ) : (
                  <>
                    View Full Leaderboard
                    <ChevronDown className="text-base" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Footer - only on larger screens */}
      <Footer />
      {/* ✅ Inline SF Pro setup */}
      <style jsx global>{`
        .font-sf {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "SF Pro Display", "Helvetica Neue", Helvetica, Arial, system-ui,
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
        }
      `}</style>

    </div>
  );
}
