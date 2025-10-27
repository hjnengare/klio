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
    width: 360,
  });

  const updatePosition = () => {
    const anchor = anchorRef?.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();

    const gap = 8; // small space below the input
    const leftPadding = 8;
    const rightPadding = 8;

    const left = Math.max(leftPadding, rect.left);
    const maxWidth = window.innerWidth - left - rightPadding;

    // Prefer anchor width but clamp to viewport
    const width = Math.min(rect.width, maxWidth);

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
                    rounded-2xl overflow-hidden
                    bg-off-white/95 backdrop-blur-xl
                    border border-white/60 shadow-xl
                    transition-all duration-200
                    ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}
        style={{
          position: "fixed",
          top: style.top,
          left: style.left,
          width: style.width || 360,
          maxWidth: "calc(100vw - 16px)",
          maxHeight: "min(70vh, 560px)",
          outline: "none",
        }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-4 pb-3 border-b border-charcoal/10 bg-off-white">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-sage" />
            <h2 className="text-sm md:text-base font-semibold text-charcoal">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-charcoal/10 bg-off-white/70 hover:bg-sage/10 hover:text-sage text-charcoal/80 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-sage/30"
            aria-label="Close filters"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* body */}
        <div
          className="px-5 sm:px-6 py-4 space-y-4 overflow-y-auto"
          style={{ maxHeight: "calc(70vh - 140px)" }}
        >
          {/* Category */}
          <section className="rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-lg" />
            <h3 className="font-urbanist text-sm font-600 text-charcoal mb-3 flex items-center gap-3 relative z-10">
              <div className="w-8 h-8 bg-sage/10 rounded-full flex items-center justify-center">
                <Utensils className="w-4 h-4 text-sage" />
              </div>
              Category
            </h3>
            <div className="flex flex-wrap gap-2 relative z-10">
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
                    className={`px-4 py-2.5 rounded-full text-sm font-urbanist font-600 flex items-center gap-2 border transition-all
                      ${
                        active
                          ? "bg-gradient-to-br from-sage to-sage/90 text-white border-sage shadow-md"
                          : "bg-white/60 text-charcoal border-white/50 hover:bg-white/80 hover:border-sage/40"
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
          <section className="rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-lg" />
            <h3 className="font-urbanist text-sm font-600 text-charcoal mb-3 flex items-center gap-3 relative z-10">
              <div className="w-8 h-8 bg-coral/10 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-coral" />
              </div>
              Minimum Rating
            </h3>
            <div className="flex flex-wrap gap-2 relative z-10">
              {[5, 4, 3, 2, 1].map((r) => {
                const active = selectedRating === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRating(active ? null : r)}
                    className={`px-4 py-2.5 rounded-full text-sm font-urbanist font-600 flex items-center gap-2 border transition-all
                      ${
                        active
                          ? "bg-gradient-to-br from-sage to-sage/90 text-white border-sage shadow-md"
                          : "bg-white/60 text-charcoal border-white/50 hover:bg-white/80 hover:border-sage/40"
                      }
                    focus:outline-none focus:ring-2 focus:ring-sage/30`}
                    aria-pressed={active}
                    aria-label={`${r}+ stars`}
                  >
                    <div className="flex">
                      {[...Array(r)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${active ? "text-white fill-white" : "text-sage fill-sage"}`} />
                      ))}
                    </div>
                    <span>{r}+</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Distance */}
          <section className="rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-lg" />
            <h3 className="font-urbanist text-sm font-600 text-charcoal mb-3 flex items-center gap-3 relative z-10">
              <div className="w-8 h-8 bg-sage/10 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-sage" />
              </div>
              Distance
            </h3>
            <div className="flex flex-wrap gap-2 relative z-10">
              {distanceOptions.map(({ distance, Icon }) => {
                const active = selectedDistance === distance;
                return (
                  <button
                    key={distance}
                    type="button"
                    onClick={() => setSelectedDistance(active ? null : distance)}
                    className={`px-4 py-2.5 rounded-full text-sm font-urbanist font-600 flex items-center gap-2 border transition-all whitespace-nowrap
                      ${
                        active
                          ? "bg-gradient-to-br from-coral to-coral/90 text-white border-coral shadow-md"
                          : "bg-white/60 text-charcoal border-white/50 hover:bg-white/80 hover:border-coral/40"
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
        <div className="flex gap-3 px-5 sm:px-6 py-4 border-t border-charcoal/10">
          <button
            onClick={handleClearAll}
            className="flex-1 rounded-full bg-white/40 text-charcoal border border-white/50 hover:bg-white/60 font-urbanist font-600 py-3 px-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage/30"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="flex-1 rounded-full bg-gradient-to-br from-sage to-sage/90 hover:from-sage/95 hover:to-sage/85 text-white font-urbanist font-600 py-3 px-4 border border-sage/50 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sage/30"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
