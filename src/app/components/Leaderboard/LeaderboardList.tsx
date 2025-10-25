"use client";

import { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import LeaderboardUser from "./LeaderboardUser";

interface LeaderboardUser {
  rank: number;
  username: string;
  reviews: number;
  badge?: string;
  avatar: string;
  totalRating?: number;
}

interface LeaderboardListProps {
  users: LeaderboardUser[];
  showFullLeaderboard: boolean;
  onToggleFullLeaderboard: () => void;
}

function LeaderboardList({ 
  users, 
  showFullLeaderboard, 
  onToggleFullLeaderboard 
}: LeaderboardListProps) {
  // Memoize the user arrays to prevent unnecessary recalculations
  const visibleUsers = useMemo(() => 
    showFullLeaderboard ? users : users.slice(0, 5), 
    [users, showFullLeaderboard]
  );
  
  const hiddenUsers = useMemo(() => 
    users.slice(5), 
    [users]
  );

  return (
    <>
      <div className="space-y-2 sm:space-y-3">
        {visibleUsers.map((user, index) => (
          <LeaderboardUser 
            key={user.rank} 
            user={user} 
            index={index} 
          />
        ))}

        <AnimatePresence>
          {showFullLeaderboard && hiddenUsers.map((user, index) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <LeaderboardUser 
                user={user} 
                index={index + 5} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="text-center mt-6 sm:mt-8">
        <button
          onClick={onToggleFullLeaderboard}
          className="font-urbanist text-sm sm:text-base font-700 text-white transition-all duration-300 px-6 sm:px-8 py-3 bg-gradient-to-br from-sage to-sage/90 rounded-full flex items-center gap-2 mx-auto shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-sage ring-1 ring-white/30"
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
    </>
  );
}

export default memo(LeaderboardList);
