"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  SlidersHorizontal,
  Utensils,
  Coffee,
  ShoppingBag,
  Gamepad2,
  Wrench,
  Star,
  Footprints,
  Car,
  Plane,
  MapPin,
} from "lucide-react";

export interface FilterState {
  categories: string[];
  minRating: number | null;
  distance: string | null;
}

interface FilterModalProps {
  isOpen: boolean;          // controls enter/exit transition
  isVisible: boolean;       // mount/unmount
  onClose: () => void;
  onApplyFilters?: (filters: FilterState) => void;
  /** element to anchor under (the search input wrapper) */
  anchorRef?: React.RefObject<HTMLElement>;
}

const sf = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
} as const;

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

  // computed position for anchored panel
  const [style, setStyle] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 480, // Increased from 360px for more premium feel
  });

  const updatePosition = () => {
    const anchor = anchorRef?.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();

    const gap = 12; // Increased gap for better visual separation
    const leftPadding = 16; // Increased padding for better mobile experience
    const rightPadding = 16;

    const left = Math.max(leftPadding, rect.left);
    const maxWidth = window.innerWidth - left - rightPadding;

    // Use a more generous minimum width and better responsive behavior
    const preferredWidth = Math.max(480, rect.width * 1.2); // At least 480px or 120% of anchor width
    const width = Math.min(preferredWidth, maxWidth);

    // Place directly under the anchor (account for page scroll)
    const top = rect.bottom + gap;

    setStyle({ top, left, width });
  };

  useEffect(() => {
    if (!isVisible) return;
    updatePosition();

    const onWin = () => updatePosition();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);

    return () => {
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [isVisible]);

  // Outside click + ESC (no body scroll lock)
  useEffect(() => {
    if (!isVisible) return;

    const onOutside = (e: Event) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef?.current?.contains(target)) return;
      onClose();
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();

    // small delay so the opening click doesn't immediately close
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", onOutside);
      document.addEventListener("touchstart", onOutside);
      document.addEventListener("keydown", onEsc);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("touchstart", onOutside);
      document.removeEventListener("keydown", onEsc);
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

  const categoryOptions = [
    { name: "Restaurants", Icon: Utensils },
    { name: "Coffee Shops", Icon: Coffee },
    { name: "Shopping", Icon: ShoppingBag },
    { name: "Entertainment", Icon: Gamepad2 },
    { name: "Services", Icon: Wrench },
  ];

  const distanceOptions = [
    { distance: "1 mile", Icon: Footprints },
    { distance: "5 miles", Icon: Car },
    { distance: "10 miles", Icon: Car },
    { distance: "25 miles", Icon: Plane },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] pointer-events-none"
      aria-hidden={!isOpen}
      style={sf}
    >
      {/* Anchored panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Search filters"
        aria-modal="true"
        tabIndex={-1}
        className={`pointer-events-auto
                    rounded-3xl overflow-hidden
                    bg-gradient-to-br from-off-white/98 via-white/95 to-off-white/98 backdrop-blur-xl
                    border border-white/80 shadow-2xl
                    transition-all duration-300 ease-out
                    ${isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95"}`}
        style={{
          position: "fixed",
          top: style.top,
          left: style.left,
          width: style.width || 480,
          maxWidth: "calc(100vw - 32px)", // Increased from 16px for better mobile margins
          maxHeight: "min(75vh, 600px)", // Increased height for more content
          outline: "none",
        }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 sm:px-8 pt-5 pb-4 border-b border-gradient-to-r from-transparent via-charcoal/10 to-transparent bg-gradient-to-r from-white/50 via-off-white/80 to-white/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage/20 to-sage/10 flex items-center justify-center shadow-sm">
              <SlidersHorizontal className="w-5 h-5 text-sage" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-charcoal font-urbanist">Advanced Filters</h2>
              <p className="text-xs text-charcoal/60 font-urbanist">Refine your search experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl border border-white/60 bg-white/60 hover:bg-sage/10 hover:text-sage hover:border-sage/30 text-charcoal/70 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage/30 shadow-sm hover:shadow-md"
            aria-label="Close filters"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* body */}
        <div
          className="px-6 sm:px-8 py-5 space-y-6 overflow-y-auto"
          style={{ maxHeight: "calc(75vh - 160px)" }}
        >
          {/* Category */}
          <section className="rounded-2xl bg-gradient-to-br from-white/60 via-white/40 to-white/60 backdrop-blur-sm border border-white/70 p-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-sage/15 to-transparent rounded-full blur-xl" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-coral/10 to-transparent rounded-full blur-lg" />
            <h3 className="font-urbanist text-base font-bold text-charcoal mb-4 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-gradient-to-br from-sage/20 to-sage/10 rounded-xl flex items-center justify-center shadow-sm">
                <Utensils className="w-5 h-5 text-sage" strokeWidth={2} />
              </div>
              <div>
                <div>Category</div>
                <div className="text-xs font-normal text-charcoal/60">Choose your interests</div>
              </div>
            </h3>
            <div className="flex flex-wrap gap-3 relative z-10">
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
                    className={`px-5 py-3 rounded-xl text-sm font-urbanist font-semibold flex items-center gap-3 border transition-all duration-200 shadow-sm
                      ${
                        active
                          ? "bg-gradient-to-br from-sage to-sage/90 text-white border-sage/50 shadow-lg hover:shadow-xl"
                          : "bg-white/70 text-charcoal border-white/60 hover:bg-white/90 hover:border-sage/40 hover:shadow-md"
                      }
                    focus:outline-none focus:ring-2 focus:ring-sage/30`}
                    aria-pressed={active}
                  >
                    <Icon className={`w-5 h-5 ${active ? "text-white" : "text-sage"}`} strokeWidth={2} />
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Rating */}
          <section className="rounded-2xl bg-gradient-to-br from-white/60 via-white/40 to-white/60 backdrop-blur-sm border border-white/70 p-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-coral/15 to-transparent rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-sage/10 to-transparent rounded-full blur-lg" />
            <h3 className="font-urbanist text-base font-bold text-charcoal mb-4 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-gradient-to-br from-coral/20 to-coral/10 rounded-xl flex items-center justify-center shadow-sm">
                <Star className="w-5 h-5 text-coral" strokeWidth={2} />
              </div>
              <div>
                <div>Minimum Rating</div>
                <div className="text-xs font-normal text-charcoal/60">Quality threshold</div>
              </div>
            </h3>
            <div className="flex flex-wrap gap-3 relative z-10">
              {[5, 4, 3, 2, 1].map((r) => {
                const active = selectedRating === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRating(active ? null : r)}
                    className={`px-5 py-3 rounded-xl text-sm font-urbanist font-semibold flex items-center gap-3 border transition-all duration-200 shadow-sm
                      ${
                        active
                          ? "bg-gradient-to-br from-coral to-coral/90 text-white border-coral/50 shadow-lg hover:shadow-xl"
                          : "bg-white/70 text-charcoal border-white/60 hover:bg-white/90 hover:border-coral/40 hover:shadow-md"
                      }
                    focus:outline-none focus:ring-2 focus:ring-coral/30`}
                    aria-pressed={active}
                    aria-label={`${r}+ stars`}
                  >
                    <div className="flex">
                      {[...Array(r)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${active ? "text-white fill-white" : "text-coral fill-coral"}`} strokeWidth={2} />
                      ))}
                    </div>
                    <span>{r}+</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Distance */}
          <section className="rounded-2xl bg-gradient-to-br from-white/60 via-white/40 to-white/60 backdrop-blur-sm border border-white/70 p-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-sage/15 to-transparent rounded-full blur-xl" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-coral/10 to-transparent rounded-full blur-lg" />
            <h3 className="font-urbanist text-base font-bold text-charcoal mb-4 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-gradient-to-br from-sage/20 to-sage/10 rounded-xl flex items-center justify-center shadow-sm">
                <MapPin className="w-5 h-5 text-sage" strokeWidth={2} />
              </div>
              <div>
                <div>Distance</div>
                <div className="text-xs font-normal text-charcoal/60">Search radius</div>
              </div>
            </h3>
            <div className="flex flex-wrap gap-3 relative z-10">
              {distanceOptions.map(({ distance, Icon }) => {
                const active = selectedDistance === distance;
                return (
                  <button
                    key={distance}
                    type="button"
                    onClick={() => setSelectedDistance(active ? null : distance)}
                    className={`px-5 py-3 rounded-xl text-sm font-urbanist font-semibold flex items-center gap-3 border transition-all duration-200 shadow-sm whitespace-nowrap
                      ${
                        active
                          ? "bg-gradient-to-br from-coral to-coral/90 text-white border-coral/50 shadow-lg hover:shadow-xl"
                          : "bg-white/70 text-charcoal border-white/60 hover:bg-white/90 hover:border-coral/40 hover:shadow-md"
                      }
                    focus:outline-none focus:ring-2 focus:ring-coral/30`}
                    aria-pressed={active}
                  >
                    <Icon className={`w-5 h-5 ${active ? "text-white" : "text-coral"}`} strokeWidth={2} />
                    <span>{distance}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* footer */}
        <div className="flex gap-4 px-6 sm:px-8 py-5 border-t border-gradient-to-r from-transparent via-charcoal/10 to-transparent bg-gradient-to-r from-white/50 via-off-white/80 to-white/50">
          <button
            onClick={handleClearAll}
            className="flex-1 rounded-xl bg-white/60 text-charcoal border border-white/70 hover:bg-white/80 hover:border-charcoal/20 font-urbanist font-semibold py-3.5 px-5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage/30 shadow-sm hover:shadow-md"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 rounded-xl bg-gradient-to-br from-sage to-sage/90 hover:from-sage/95 hover:to-sage/85 text-white font-urbanist font-semibold py-3.5 px-5 border border-sage/50 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sage/30"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
