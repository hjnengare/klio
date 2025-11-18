"use client";

import { memo } from "react";
import Link from "next/link";
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
  id?: string;
}

interface LeaderboardUserProps {
  user: LeaderboardUser;
  index: number;
  isMobile?: boolean;
}

function LeaderboardUser({ user, index, isMobile = false }: LeaderboardUserProps) {
  return (
    <Link href={user.id ? `/reviewer/${user.id}` : '#'} className="w-full">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className="group bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 rounded-lg overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer border border-white/50 backdrop-blur-md ring-1 ring-white/20 hover:shadow-xl transition-all duration-300 w-full"
      >
      <div className={`flex items-center justify-between ${isMobile ? 'p-5' : 'p-3 sm:p-4'}`}>
        <div className={`flex items-center ${isMobile ? 'gap-4' : 'gap-3 sm:gap-4'} flex-1 min-w-0`}>
          <div className={`${isMobile ? 'w-10 h-10' : 'w-7 h-7 sm:w-8 sm:h-8'} bg-gradient-to-br from-charcoal/15 to-charcoal/10 rounded-full flex items-center justify-center font-urbanist ${isMobile ? 'text-body-sm' : 'text-caption sm:text-body-sm'} font-600 text-charcoal/70 shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex-shrink-0 border border-white/40`}>
            {user.rank}
          </div>
          <div className={`${isMobile ? 'w-14 h-14' : 'w-10 h-10 sm:w-12 sm:h-12'} relative rounded-full overflow-hidden border-2 border-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] ring-2 ring-white/50 flex-shrink-0`}>
            <FallbackImage
              src={user.avatar}
              alt={user.username}
              fill
              className="object-cover"
              sizes={isMobile ? "(max-width: 640px) 56px" : "(max-width: 640px) 40px, 48px"}
              fallbackType="profile"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className={`font-urbanist ${isMobile ? 'text-body' : 'text-body-sm sm:text-body'} font-600 text-charcoal truncate`}>@{user.username}</div>
            <div className={`font-urbanist ${isMobile ? 'text-body-sm' : 'text-caption sm:text-body-sm'} text-charcoal/60`}>
              <span className="font-700">{user.reviews}</span> <span className="font-400">reviews</span>
            </div>
          </div>
        </div>
        <div className={`bg-gradient-to-br from-off-white via-off-white to-off-white/90 backdrop-blur-xl ${isMobile ? 'px-3 py-2' : 'px-2 sm:px-3 py-1'} rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-white/60 ring-1 ring-white/30 flex items-center gap-1 flex-shrink-0`}>
          <Star className={`${isMobile ? 'w-5 h-5' : 'text-body-sm'} text-coral`} />
          <span className={`font-urbanist ${isMobile ? 'text-body' : 'text-body-sm'} font-600 text-charcoal`}>{user.totalRating || 4.8}</span>
        </div>
      </div>
    </motion.div>
    </Link>
  );
}

export default memo(LeaderboardUser);
