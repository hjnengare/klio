"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ToastNotificationData } from "../components/ToastNotification/ToastNotification";
import { generateRandomNotification } from "../data/notificationData";

interface UseToastNotificationsOptions {
  interval?: number; // Time between notifications in ms
  maxToasts?: number; // Maximum simultaneous toasts
  enabled?: boolean; // Whether to generate notifications
}

export function useToastNotifications({
  interval = 15000, // Show notification every 15 seconds
  maxToasts = 3,
  enabled = true,
}: UseToastNotificationsOptions = {}) {
  const [notifications, setNotifications] = useState<ToastNotificationData[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isClient = useRef(false);

  // Generate a new notification
  const addNotification = useCallback(() => {
    setNotifications((prev) => {
      // Don't add if we're at max
      if (prev.length >= maxToasts) {
        return prev;
      }

      const newNotification = generateRandomNotification();
      return [...prev, newNotification];
    });
  }, [maxToasts]);

  // Remove a notification by ID
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Set client flag
  useEffect(() => {
    isClient.current = true;
  }, []);

  // Auto-generate notifications
  useEffect(() => {
    if (!enabled || !isClient.current) return;

    // Initial delay before first notification (3-7 seconds)
    const initialDelay = 3000 + Math.random() * 4000;

    const initialTimer = setTimeout(() => {
      addNotification();

      // Then set up recurring notifications with some randomness
      intervalRef.current = setInterval(() => {
        // Add some randomness to timing (±3 seconds)
        const randomDelay = interval + (Math.random() - 0.5) * 6000;

        setTimeout(() => {
          addNotification();
        }, Math.max(0, randomDelay - interval));
      }, interval);
    }, initialDelay);

    return () => {
      clearTimeout(initialTimer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };
}
