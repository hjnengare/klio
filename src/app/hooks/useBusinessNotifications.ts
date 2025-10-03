"use client";

import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';

export function useBusinessNotifications() {
  const { showToast } = useToast();
  const subscriptionRef = useRef<any>(null);
  const lastNotificationTimeRef = useRef<number>(0);

  useEffect(() => {
    // Don't subscribe if not in browser
    if (typeof window === 'undefined') return;

    // Throttle notifications to prevent spam (min 5 seconds between notifications)
    const THROTTLE_MS = 5000;

    const handleNewBusiness = (payload: any) => {
      const now = Date.now();

      // Throttle notifications
      if (now - lastNotificationTimeRef.current < THROTTLE_MS) {
        return;
      }

      lastNotificationTimeRef.current = now;

      // Show toast notification
      const businessName = payload.new?.name || 'A new business';
      showToast(
        `${businessName} just joined KLIO! 🎉`,
        'sage',
        6000
      );
    };

    // Subscribe to new inserts in the businesses table
    const channel = supabase
      .channel('business-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'businesses'
        },
        handleNewBusiness
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Subscribed to business notifications');
        }
      });

    subscriptionRef.current = channel;

    // Cleanup subscription on unmount
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        console.log('🔌 Unsubscribed from business notifications');
      }
    };
  }, [showToast]);
}
