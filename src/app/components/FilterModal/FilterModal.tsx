// src/components/FilterModal/FilterModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";

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
    const left = Math.max(8, rect.left); // keep from touching viewport edge
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  // close on outside click/touch and prevent background scroll
  useEffect(() => {
    if (!isVisible) return;

    // Prevent background scroll
    document.body.style.overflow = "hidden";

    const onOutsideInteraction = (e: Event) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef?.current?.contains(target)) return;
      onClose();
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();

    // Listen for both mouse and touch events
    document.addEventListener("mousedown", onOutsideInteraction);
    document.addEventListener("touchstart", onOutsideInteraction);
    document.addEventListener("keydown", onEsc);

    return () => {
      document.removeEventListener("mousedown", onOutsideInteraction);
      document.removeEventListener("touchstart", onOutsideInteraction);
      document.removeEventListener("keydown", onEsc);
      // Restore background scroll
      document.body.style.overflow = "";
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
      // no dark backdrop — just a high z-index layer holding the panel
      className="fixed inset-0 z-[70] pointer-events-none"
      aria-hidden={!isOpen}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Search filters"
        tabIndex={-1}
        className={`pointer-events-auto bg-off-white border border-charcoal/20 shadow-lg flex flex-col
                    ${isOpen ? "opacity-100" : "opacity-0"}`}
        style={{
          position: "fixed",
          top: style.top,
          left: style.left,
          width: style.width || 360,
          maxWidth: "calc(100vw - 16px)",
          maxHeight: "min(70vh, 560px)",
          overflow: "hidden",
        }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-4 pb-3 border-b border-gray-200">
          <div>
            <h2 className="font-urbanist text-sm md:text-base font-700 text-charcoal flex items-center">
              <ion-icon name="options" class="text-sage mr-2 text-base" />
              Filters
            </h2>
            <p className="font-urbanist text-xs text-charcoal/60 mt-0.5">Refine your search</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 border border-gray-300 bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            aria-label="Close filters"
          >
            <ion-icon name="close" class="text-base text-charcoal/70" />
          </button>
        </div>

        {/* body (scrollable) */}
        <div className="px-5 sm:px-6 py-4 space-y-4 overflow-y-auto flex-1" style={{ maxHeight: "calc(70vh - 140px)" }}>
          {/* Category */}
          <div className="bg-gray-50 p-4 border border-gray-200">
            <h3 className="font-urbanist text-sm font-600 text-charcoal mb-3 flex items-center">
              <ion-icon name="restaurant" class="text-sage mr-2 text-base" />
              Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Restaurants", icon: "restaurant" },
                { name: "Coffee Shops", icon: "cafe" },
                { name: "Shopping", icon: "bag" },
                { name: "Entertainment", icon: "game-controller" },
                { name: "Services", icon: "construct" },
              ].map((c) => (
                <label
                  key={c.name}
                  className="group flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 border border-transparent hover:border-gray-300 flex-shrink-0"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(c.name)}
                    onChange={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(c.name) ? prev.filter((x) => x !== c.name) : [...prev, c.name]
                      )
                    }
                    className="w-4 h-4 text-sage bg-off-white border-2 border-charcoal/20 focus:ring-2 focus:ring-sage/30"
                  />
                  <ion-icon name={c.icon} class="text-sage text-base" />
                  <span className="font-urbanist text-sm font-500 text-charcoal">{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="bg-gray-50 p-4 border border-gray-200">
            <h3 className="font-urbanist text-sm font-600 text-charcoal mb-3 flex items-center">
              <ion-icon name="star" class="text-sage mr-2 text-base" />
              Minimum Rating
            </h3>
            <div className="flex flex-wrap gap-2">
              {[5, 4, 3, 2, 1].map((r) => (
                <label
                  key={r}
                  className="group flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 border border-transparent hover:border-gray-300 flex-shrink-0"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={selectedRating === r}
                    onChange={() => setSelectedRating(r)}
                    className="w-4 h-4 text-sage bg-off-white border-2 border-charcoal/20 focus:ring-2 focus:ring-sage/30"
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(r)].map((_, i) => (
                        <ion-icon key={i} name="star" class="text-sage text-base" />
                      ))}
                    </div>
                    <span className="font-urbanist text-sm text-charcoal">{r}+ stars</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div className="bg-gray-50 p-4 border border-gray-200">
            <h3 className="font-urbanist text-sm font-600 text-charcoal mb-3 flex items-center">
              <ion-icon name="location" class="text-sage mr-2 text-base" />
              Distance
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { distance: "1 mile", icon: "walk" },
                { distance: "5 miles", icon: "car" },
                { distance: "10 miles", icon: "car-sport" },
                { distance: "25 miles", icon: "airplane" },
              ].map((d) => (
                <label
                  key={d.distance}
                  className="group flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 border border-transparent hover:border-gray-300 flex-shrink-0"
                >
                  <input
                    type="radio"
                    name="distance"
                    checked={selectedDistance === d.distance}
                    onChange={() => setSelectedDistance(d.distance)}
                    className="w-4 h-4 text-sage bg-off-white border-2 border-charcoal/20 focus:ring-2 focus:ring-sage/30"
                  />
                  <ion-icon name={d.icon} class="text-sage text-base" />
                  <span className="font-urbanist text-sm text-charcoal whitespace-nowrap">{d.distance}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex gap-3 px-5 sm:px-6 py-4 border-t border-charcoal/20 bg-off-white">
          <button
            onClick={handleClearAll}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-charcoal font-urbanist font-600 py-2.5 px-4 border border-gray-300"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-sage hover:bg-sage/90 text-white font-urbanist font-600 py-2.5 px-4 border border-sage"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
