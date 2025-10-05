"use client";

import { motion } from "framer-motion";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  delay?: number;
}

export default function VerifiedBadge({ size = "md", delay = 0 }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const iconSizes = {
    sm: "10px",
    md: "12px",
    lg: "14px"
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        delay,
        duration: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 10
      }}
      className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-premium-sm ring-2 ring-off-white`}
    >
      <ion-icon name="checkmark" style={{ fontSize: iconSizes[size], color: 'white' }} />
    </motion.div>
  );
}