// src/components/FilterModal/FilterModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { lockBodyScroll } from "../../utils/lockBodyScroll";

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

  const [style, setStyle] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });

  // position under the anchor (Unsplash-like)
  const updatePosition = () => {
    const anchor = anchorRef?.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const top = rect.bottom + 8; // gap below input
    const left = Math.max(8, rect.left);
    const rightPadding = 8;
    const maxWidth = window.innerWidth - left - rightPadding;
    const width = Math.min(rect.width, maxWidth);
    setStyle({ top, left, width });
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

    // Delay binding so the initial focus/click that opens the modal doesn't instantly close it
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

  const categoryOptions = [
    { name: "Restaurants", icon: "restaurant" },
    { name: "Coffee Shops", icon: "cafe" },
    { name: "Shopping", icon: "bag" },
    { name: "Entertainment", icon: "game-controller" },
    { name: "Services", icon: "construct" },
  ];

  const distanceOptions = [
    { distance: "1 mile", icon: "walk" },
    { distance: "5 miles", icon: "car" },
    { distance: "10 miles", icon: "car-sport" },
    { distance: "25 miles", icon: "airplane" },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] pointer-events-none"
      aria-hidden={!isOpen}
      style={sf}
    >
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
          maxWidth: "calc(100vw - 16px)",
          maxHeight: "min(70vh, 560px)",
          outline: "none",
        }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-4 pb-3 border-b border-charcoal/10 bg-white/60 backdrop-blur-sm">
          <div>
            <h2 className="text-sm md:text-base font-semibold text-charcoal flex items-center gap-2">
              <ion-icon name="options" className="text-sage text-base" />
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
            <ion-icon name="close" className="text-base" />
          </button>
        </div>

        {/* body */}
        <div className="px-5 sm:px-6 py-4 space-y-4 overflow-y-auto" style={{ maxHeight: "calc(70vh - 140px)" }}>
          {/* Category */}
          <section className="rounded-xl bg-white/70 border border-charcoal/10 p-4">
            <h3 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
              <ion-icon name="restaurant" className="text-sage text-base" />
              Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((c) => {
                const active = selectedCategories.includes(c.name);
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(c.name) ? prev.filter((x) => x !== c.name) : [...prev, c.name]
                      )
                    }
                    className={`px-3 py-2 rounded-full text-sm flex items-center gap-2 border transition-all
                      ${active
                        ? "bg-sage text-white border-sage shadow-sm"
                        : "bg-white text-charcoal border-charcoal/10 hover:border-sage/40 hover:bg-sage/5"}
                    focus:outline-none focus:ring-2 focus:ring-sage/30`}
                    aria-pressed={active}
                  >
                    <ion-icon name={c.icon} className={`text-base ${active ? "text-white" : "text-sage"}`} />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Rating */}
          <section className="rounded-xl bg-white/70 border border-charcoal/10 p-4">
            <h3 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
              <ion-icon name="star" className="text-sage text-base" />
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
                      ${active
                        ? "bg-sage text-white border-sage shadow-sm"
                        : "bg-white text-charcoal border-charcoal/10 hover:border-sage/40 hover:bg-sage/5"}
                    focus:outline-none focus:ring-2 focus:ring-sage/30`}
                    aria-pressed={active}
                    aria-label={`${r}+ stars`}
                  >
                    <div className="flex">
                      {[...Array(r)].map((_, i) => (
                        <ion-icon key={i} name="star" className={`text-base ${active ? "text-white" : "text-sage"}`} />
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
              <ion-icon name="location" className="text-sage text-base" />
              Distance
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { distance: "1 mile", icon: "walk" },
                { distance: "5 miles", icon: "car" },
                { distance: "10 miles", icon: "car-sport" },
                { distance: "25 miles", icon: "airplane" },
              ].map((d) => {
                const active = selectedDistance === d.distance;
                return (
                  <button
                    key={d.distance}
                    type="button"
                    onClick={() => setSelectedDistance(active ? null : d.distance)}
                    className={`px-3 py-2 rounded-full text-sm flex items-center gap-2 border transition-all whitespace-nowrap
                      ${active
                        ? "bg-coral text-white border-coral shadow-sm"
                        : "bg-white text-charcoal border-charcoal/10 hover:border-coral/40 hover:bg-coral/5"}
                    focus:outline-none focus:ring-2 focus:ring-coral/30`}
                    aria-pressed={active}
                  >
                    <ion-icon name={d.icon} className={`text-base ${active ? "text-white" : "text-coral"}`} />
                    <span>{d.distance}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* footer */}
        <div className="flex gap-3 px-5 sm:px-6 py-4 border-t border-white/60 bg-white/80 backdrop-blur-sm">
          <button
            onClick={() => {
              setSelectedCategories([]);
              setSelectedRating(null);
              setSelectedDistance(null);
            }}
            className="flex-1 rounded-full bg-white text-charcoal border border-charcoal/15 hover:bg-charcoal/5 font-semibold py-2.5 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-sage/30"
          >
            Clear
          </button>
          <button
            onClick={() => {
              onApplyFilters?.({
                categories: selectedCategories,
                minRating: selectedRating,
                distance: selectedDistance,
              });
              onClose();
            }}
            className="flex-1 rounded-full bg-sage hover:bg-sage/90 text-white font-semibold py-2.5 px-4 border border-sage transition-colors focus:outline-none focus:ring-2 focus:ring-sage/30"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
