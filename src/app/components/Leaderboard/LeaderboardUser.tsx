"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import FallbackImage from "../FallbackImage/FallbackImage";

interface LeaderboardUser {
  rank: number;
  username: string;
  reviews: number;
  badge?: string;
  avatar: string;
  totalRating?: number;
}

interface LeaderboardUserProps {
  user: LeaderboardUser;
  index: number;
}

export default function LeaderboardUser({ user, index }: LeaderboardUserProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
      className="group bg-off-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm cursor-pointer border border-charcoal/10"
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
            <div className="font-sf text-xs sm:text-sm text-charcoal/60">
              <span className="font-700">{user.reviews}</span> <span className="font-400">reviews</span>
            </div>
          </div>
        </div>
        <div className="bg-off-white/50 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full shadow-sm border border-white/30 flex items-center gap-1 flex-shrink-0">
          <Star className="text-sm text-coral" />
          <span className="font-sf text-sm font-600 text-charcoal">{user.totalRating || 4.8}</span>
        </div>
      </div>
    </motion.div>
  );
}
