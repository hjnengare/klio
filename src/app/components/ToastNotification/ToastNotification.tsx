"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export interface ToastNotificationData {
  id: string;
  type: "review" | "business" | "user";
  message: string;
  title: string;
  timeAgo: string;
  image: string;
  imageAlt: string;
  link?: string;
}

interface ToastNotificationProps {
  notification: ToastNotificationData;
  onClose: () => void;
  duration?: number;
}

export default function ToastNotification({
  notification,
  onClose,
  duration = 5000,
}: ToastNotificationProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="notification-toast relative bg-white rounded-lg shadow-lg overflow-hidden w-80 max-w-[calc(100vw-2rem)]"
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-sage/10">
        <motion.div
          className="h-full bg-sage"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>

      <div className="flex items-start gap-3 p-4 pt-5">
        {/* Close button */}
        <button
          onClick={onClose}
          className="toast-close-btn absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-charcoal/10 transition-colors z-10"
          aria-label="Close notification"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-charcoal/60"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Image banner */}
        <div className="toast-banner flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden bg-sage/10">
          <Image
            src={notification.image}
            alt={notification.imageAlt}
            fill
            sizes="80px"
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Details */}
        <div className="toast-detail flex-1 min-w-0">
          <p className="toast-message font-urbanist text-6 font-400 text-charcoal/60 mb-1">
            {notification.message}
          </p>

          <p className="toast-title font-urbanist text-5 font-600 text-charcoal line-clamp-2 mb-1">
            {notification.title}
          </p>

          <p className="toast-meta font-urbanist text-7 font-400 text-charcoal/50">
            <time>{notification.timeAgo}</time> ago
          </p>
        </div>
      </div>
    </motion.div>
  );
}
