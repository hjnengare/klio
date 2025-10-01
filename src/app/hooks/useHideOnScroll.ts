// src/hooks/useHideOnScroll.ts
import { useEffect, useRef, useState } from "react";

/**
 * Hide on scroll-down, show on scroll-up — but:
 * - throttled (perf)
 * - hysteresis (no flicker)
 * - never hide near top
 * - pauses while overlays/menus are open
 */
export function useHideOnScroll(opts?: {
  /** px past top before we allow hiding (default 80) */
  topSafe?: number;
  /** px you must scroll in one direction before we toggle (default 24) */
  hysteresis?: number;
  /** throttle in ms (default 60 ~ 16fps) */
  throttleMs?: number;
  /** optional external flag to force show (e.g., when mobile menu open) */
  forceShow?: boolean;
}) {
  const topSafe = opts?.topSafe ?? 80;
  const hysteresis = opts?.hysteresis ?? 24;
  const throttleMs = opts?.throttleMs ?? 60;
  const forceShow = !!opts?.forceShow;

  const [visible, setVisible] = useState(true);
  const lastYRef = useRef(0);
  const accRef = useRef(0); // accumulated delta since last toggle
  const tickingRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    lastYRef.current = window.scrollY || 0;
    setVisible(true);

    const onScroll = () => {
      // throttle via rAF + time
      if (tickingRef.current) return;
      tickingRef.current = true;

      rafRef.current = window.requestAnimationFrame(() => {
        tickingRef.current = false;

        const y = window.scrollY || 0;
        const dy = y - lastYRef.current;
        lastYRef.current = y;

        // Always visible when forced or near the top
        if (forceShow || y < topSafe) {
          accRef.current = 0;
          if (!visible) setVisible(true);
          return;
        }

        // Accumulate movement
        // dy > 0 scrolling down, dy < 0 scrolling up
        if (Math.sign(dy) !== Math.sign(accRef.current)) {
          // direction changed — reset accumulator
          accRef.current = dy;
        } else {
          accRef.current += dy;
        }

        // Toggle when we've moved enough in one direction
        if (accRef.current > hysteresis && visible) {
          setVisible(false);   // hide on down
          accRef.current = 0;
        } else if (accRef.current < -hysteresis && !visible) {
          setVisible(true);    // show on up
          accRef.current = 0;
        }
      });
    };

    // passive for perf
    window.addEventListener("scroll", onScroll, { passive: true });

    let t: number | null = null;
    const onWheelOrTouchEnd = () => {
      // small debounce so header can settle
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => (accRef.current = 0), throttleMs);
    };
    window.addEventListener("wheel", onWheelOrTouchEnd, { passive: true });
    window.addEventListener("touchend", onWheelOrTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheelOrTouchEnd);
      window.removeEventListener("touchend", onWheelOrTouchEnd);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceShow, topSafe, hysteresis, throttleMs]);

  return { visible };
}
