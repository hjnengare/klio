"use client";

import { useBusinessNotifications } from '../../hooks/useBusinessNotifications';

/**
 * BusinessNotifications Component
 *
 * Listens for real-time business insertions via Supabase and displays
 * toast notifications at the bottom-left of the screen.
 *
 * This component should be placed once in the app layout.
 */
export default function BusinessNotifications() {
  useBusinessNotifications();

  // This component doesn't render anything - it just sets up the subscription
  return null;
}
