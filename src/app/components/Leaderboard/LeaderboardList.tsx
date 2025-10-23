"use client";

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

export default function LeaderboardList({ 
  users, 
  showFullLeaderboard, 
  onToggleFullLeaderboard 
}: LeaderboardListProps) {
  const visibleUsers = showFullLeaderboard ? users : users.slice(0, 5);
  const hiddenUsers = users.slice(5);

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
    </>
  );
}
