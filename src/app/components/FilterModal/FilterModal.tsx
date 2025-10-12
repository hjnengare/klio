// src/components/FilterModal/FilterModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { lockBodyScroll } from "../../utils/lockBodyScroll";

// ✅ lucide-react icon imports
import {
  X,
  SlidersHorizontal,
  Utensils,
  Coffee,
  ShoppingBag,
  Gamepad2,
  Wrench,
  Footprints,
  Car,
  Plane,
  Star,
  MapPin,
} from "lucide-react";

export interface FilterState {
  categories: string[];
  minRating: number | null;
  distance: string | null;
}

interface FilterModalProps {
  isOpen: boolean;          // controls animation
  isVisible: boolean;       // mounts/unmounts
  onClose: () => void;
  onApplyFilters?: (filters: FilterState) => void;
  /** element to anchor under (the search input wrapper) */
  anchorRef?: React.RefObject<HTMLElement>;
}

const sf = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
} as const;

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

// Options mapped to lucide icons
const categoryOptions: { name: string; Icon: IconType }[] = [
  { name: "Restaurants",   Icon: Utensils },
  { name: "Coffee Shops",  Icon: Coffee },
  { name: "Shopping",      Icon: ShoppingBag },
  { name: "Entertainment", Icon: Gamepad2 },
  { name: "Services",      Icon: Wrench },
];

const distanceOptions: { distance: string; Icon: IconType }[] = [
  { distance: "1 mile",  Icon: Footprints },
  { distance: "5 miles", Icon: Car },
  { distance: "10 miles", Icon: Car },
  { distance: "25 miles", Icon: Plane },
];

export default function FilterModal({
  isOpen,
  isVisible,
  onClose,
  onApplyFilters,
  anchorRef,
}: FilterModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const firstInteractiveRef = useRef<HTMLButtonElement>(null);

  // Track sheet position + computed maxHeight for full-width mode
  const [style, setStyle] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
  }>({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 560,
  });

  // position as a full-width sheet under the anchor
  const updatePosition = () => {
    const anchor = anchorRef?.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const top = Math.max(0, rect.bottom + 8); // gap below input
    const left = 0; // full-screen width
    const width = window.innerWidth; // full-bleed
    // leave a small bottom margin (16px) and cap at 640px to avoid absurd heights on big screens
    const available = window.innerHeight - top - 16;
    const maxHeight = Math.max(280, Math.min(available, 640));
    setStyle({ top, left, width, maxHeight });
  };

  useEffect(() => {
    if (!isVisible) return;
    updatePosition();
    const r = () => updatePosition();
    window.addEventListener("resize", r);
    window.addEventListener("scroll", r, true);
    return () => {
      window.removeEventListener("resize", r);
      window.removeEventListener("scroll", r, true);
    };
  }, [isVisible]);

  // focus management + close on outside + prevent background scroll
  useEffect(() => {
    if (!isVisible) return;

    const unlock = lockBodyScroll();

    // Focus the first interactive element on open
    const focusTimer = setTimeout(() => {
      firstInteractiveRef.current?.focus();
    }, 0);

    const onOutside = (e: Event) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef?.current?.contains(target)) return;
      onClose();
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();

    // Delay binding so the initial click that opens the modal doesn't instantly close it
    const bindTimer = setTimeout(() => {
      document.addEventListener("click", onOutside);
      document.addEventListener("touchstart", onOutside);
      document.addEventListener("keydown", onEsc);
    }, 0);

    return () => {
      clearTimeout(focusTimer);
      clearTimeout(bindTimer);
      document.removeEventListener("click", onOutside);
      document.removeEventListener("touchstart", onOutside);
      document.removeEventListener("keydown", onEsc);
      unlock();
    };
  }, [isVisible, onClose, anchorRef]);

  const handleApply = () => {
    onApplyFilters?.({
      categories: selectedCategories,
      minRating: selectedRating,
      distance: selectedDistance,
    });
    onClose();
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedRating(null);
    setSelectedDistance(null);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[70] pointer-events-none"
      aria-hidden={!isOpen}
      style={sf}
    >
      {/* Optional translucent backdrop for emphasis (clicks handled by document listener) */}
      <div
        className={`absolute inset-0 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
        style={{ background: "rgba(0,0,0,0.08)" }}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-label="Search filters"
        aria-modal="true"
        tabIndex={-1}
        className={`pointer-events-auto
                    rounded-2xl overflow-hidden
                    bg-white/95 backdrop-blur-xl
                    border border-white/60 shadow-xl
                    transition-all duration-200
                    ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}
        style={{
          position: "fixed",
          top: style.top,
          left: style.left,
          width: style.width || 360,
          maxWidth: "100vw",            // ✅ full screen width
          maxHeight: style.maxHeight,   // computed from viewport & anchor
          outline: "none",
        }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-4 pb-3 border-b border-charcoal/10 bg-white/60 backdrop-blur-sm">
          <div>
            <h2 className="text-sm md:text-base font-semibold text-charcoal flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-sage" />
              Filters
            </h2>
            <p className="text-xs text-charcoal/60 mt-0.5">Refine your search</p>
          </div>
          <button
            ref={firstInteractiveRef}
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-charcoal/10 bg-white/70 hover:bg-sage/10 hover:text-sage text-charcoal/80 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-sage/30"
            aria-label="Close filters"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* body */}
        <div
          className="px-5 sm:px-6 py-4 space-y-4 overflow-y-auto"
          style={{ maxHeight: style.maxHeight - 112 /* header+footer approx */ }}
        >
          {/* Category */}
          <section className="rounded-xl bg-white/70 border border-charcoal/10 p-4">
            <h3 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-sage" />
              Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map(({ name, Icon }) => {
                const active = selectedCategories.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
                      )
                    }
                    className={`px-3 py-2 rounded-full text-sm flex items-center gap-2 border transition-all
                      ${
                        active
                          ? "bg-sage text-white border-sage shadow-sm"
                          : "bg-white text-charcoal border-charcoal/10 hover:border-sage/40 hover:bg-sage/5"
                      }
                    focus:outline-none focus:ring-2 focus:ring-sage/30`}
                    aria-pressed={active}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-white" : "text-sage"}`} />
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Rating */}
          <section className="rounded-xl bg-white/70 border border-charcoal/10 p-4">
            <h3 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-sage" />
              Minimum Rating
            </h3>
            <div className="flex flex-wrap gap-2">
              {[5, 4, 3, 2, 1].map((r) => {
                const active = selectedRating === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRating(active ? null : r)}
                    className={`px-3 py-2 rounded-full text-sm flex items-center gap-2 border transition-all
                      ${
                        active
                          ? "bg-sage text-white border-sage shadow-sm"
                          : "bg-white text-charcoal border-charcoal/10 hover:border-sage/40 hover:bg-sage/5"
                      }
                    focus:outline-none focus:ring-2 focus:ring-sage/30`}
                    aria-pressed={active}
                    aria-label={`${r}+ stars`}
                  >
                    <div className="flex">
                      {Array.from({ length: r }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${active ? "text-white" : "text-sage"}`} />
                      ))}
                    </div>
                    <span>{r}+</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Distance */}
          <section className="rounded-xl bg-white/70 border border-charcoal/10 p-4">
            <h3 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sage" />
              Distance
            </h3>
            <div className="flex flex-wrap gap-2">
              {distanceOptions.map(({ distance, Icon }) => {
                const active = selectedDistance === distance;
                return (
                  <button
                    key={distance}
                    type="button"
                    onClick={() => setSelectedDistance(active ? null : distance)}
                    className={`px-3 py-2 rounded-full text-sm flex items-center gap-2 border transition-all whitespace-nowrap
                      ${
                        active
                          ? "bg-coral text-white border-coral shadow-sm"
                          : "bg-white text-charcoal border-charcoal/10 hover:border-coral/40 hover:bg-coral/5"
                      }
                    focus:outline-none focus:ring-2 focus:ring-coral/30`}
                    aria-pressed={active}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-white" : "text-coral"}`} />
                    <span>{distance}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* footer */}
        <div className="flex gap-3 px-5 sm:px-6 py-4 border-t border-white/60 bg-white/80 backdrop-blur-sm">
          <button
            onClick={handleClearAll}
            className="flex-1 rounded-full bg-white text-charcoal border border-charcoal/15 hover:bg-charcoal/5 font-semibold py-2.5 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-sage/30"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="flex-1 rounded-full bg-sage hover:bg-sage/90 text-white font-semibold py-2.5 px-4 border border-sage transition-colors focus:outline-none focus:ring-2 focus:ring-sage/30"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
