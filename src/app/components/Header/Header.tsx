// src/components/Header/Header.tsx
"use client";

import { useRef, useState, useEffect, useLayoutEffect, useCallback, Fragment } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import { User, X, Search, Briefcase, ChevronDown, Compass } from "react-feather";
import FilterModal, { FilterState } from "../FilterModal/FilterModal";
import SearchInput from "../SearchInput/SearchInput";
import { useSavedItems } from "../../contexts/SavedItemsContext";
import Logo from "../Logo/Logo";
import OptimizedLink from "../Navigation/OptimizedLink";

const sf = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
} as const;

const PRIMARY_LINKS = [
  { key: "home", label: "Home", href: "/home" },
  { key: "saved", label: "Saved", href: "/saved" },
] as const;

const DISCOVER_LINKS = [
  { key: "explore", label: "Explore", description: "Browse all businesses", href: "/explore" },
  { key: "for-you", label: "For You", description: "Personalized picks", href: "/for-you" },
  { key: "trending", label: "Trending", description: "What’s hot right now", href: "/trending" },
  { key: "leaderboard", label: "Leaderboard", description: "Top community voices", href: "/leaderboard" },
  { key: "events-specials", label: "Events & Specials", description: "Seasonal happenings & offers", href: "/events-specials" },
] as const;

const BUSINESS_LINKS = [
  { key: "business-login", label: "Business Login", description: "Access your business account", href: "/business/login" },
  { key: "claim-business", label: "Claim Business", description: "Add your business to sayso", href: "/claim-business" },
  { key: "manage-business", label: "Manage Business", description: "Update and track performance", href: "/manage-business" },
] as const;

export default function Header({
  showSearch = true,
  variant = "white",
  backgroundClassName,
  searchLayout = "floating",
  forceSearchOpen = false,
  topPosition = "top-6",
  reducedPadding = false,
  whiteText = false,
}: {
  showSearch?: boolean;
  variant?: "white" | "frosty";
  backgroundClassName?: string;
  searchLayout?: "floating" | "stacked";
  forceSearchOpen?: boolean;
  topPosition?: string;
  reducedPadding?: boolean;
  whiteText?: boolean;
}) {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDiscoverDropdownOpen, setIsDiscoverDropdownOpen] = useState(false);
  const [isDiscoverDropdownClosing, setIsDiscoverDropdownClosing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isStackedLayout = searchLayout === "stacked";

  const [showSearchBar, setShowSearchBar] = useState(() => {
    if (forceSearchOpen || isStackedLayout) {
      return true;
    }
    return searchParams.get("openSearch") === "true";
  });
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);
  const [isBusinessDropdownClosing, setIsBusinessDropdownClosing] = useState(false);
  const [menuPos, setMenuPos] = useState<{left:number; top:number}>({left:0, top:0});
  const [discoverMenuPos, setDiscoverMenuPos] = useState<{left:number; top:number}>({left:0, top:0});
  const { savedCount } = useSavedItems();

  // Use refs to track state without causing re-renders
  const isFilterVisibleRef = useRef(isFilterVisible);
  const isBusinessDropdownOpenRef = useRef(isBusinessDropdownOpen);
  const isDiscoverDropdownOpenRef = useRef(isDiscoverDropdownOpen);
  const showSearchBarRef = useRef(showSearchBar);

  // Update refs when state changes
  useEffect(() => {
    isFilterVisibleRef.current = isFilterVisible;
  }, [isFilterVisible]);

  useEffect(() => {
    isBusinessDropdownOpenRef.current = isBusinessDropdownOpen;
  }, [isBusinessDropdownOpen]);

  useEffect(() => {
    isDiscoverDropdownOpenRef.current = isDiscoverDropdownOpen;
  }, [isDiscoverDropdownOpen]);

  useEffect(() => {
    showSearchBarRef.current = showSearchBar;
  }, [showSearchBar]);

  useEffect(() => {
    if (forceSearchOpen || isStackedLayout) {
      setShowSearchBar(true);
    }
  }, [forceSearchOpen, isStackedLayout]);

  // Anchor for the dropdown FilterModal to hang under
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const businessDropdownRef = useRef<HTMLDivElement>(null);
  const businessMenuPortalRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const discoverDropdownRef = useRef<HTMLDivElement>(null);
  const discoverMenuPortalRef = useRef<HTMLDivElement>(null);
  const discoverBtnRef = useRef<HTMLButtonElement>(null);

  // Scroll-based header visibility
  useEffect(() => {
    let lastKnownScrollY = window.scrollY;

    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      // Hide when scrolled down past 100px
      if (currentScrollY > 100) {
      const isScrollingDown = currentScrollY > lastKnownScrollY;
      const isScrollingUp = currentScrollY < lastKnownScrollY;

      if (isScrollingDown) {
          setIsHeaderVisible(false);
        } else if (isScrollingUp) {
          // Show immediately on scroll up
          setIsHeaderVisible(true);
        }
      } else {
        // Always show when above 100px
        setIsHeaderVisible(true);
      }

      lastKnownScrollY = currentScrollY;
    };

    // Add scroll event listener with throttling
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          controlHeader();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

  useEffect(() => {
  if (forceSearchOpen || isStackedLayout) {
    return;
  }

    const openFromParam = searchParams.get("openSearch") === "true";

    if (openFromParam && !showSearchBarRef.current) {
      setShowSearchBar(true);
    }

    if (openFromParam) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("openSearch");
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    }
}, [searchParams, pathname, router, forceSearchOpen, isStackedLayout]);

  // Close all modals on scroll - memoized with useCallback
  const closeModalsOnScroll = useCallback(() => {
    // Only close if they're actually open to avoid unnecessary state updates
    if (isBusinessDropdownOpenRef.current) {
      setIsBusinessDropdownOpen(false);
    }
  if (isDiscoverDropdownOpenRef.current) {
    setIsDiscoverDropdownClosing(true);
    setTimeout(() => {
      setIsDiscoverDropdownOpen(false);
      setIsDiscoverDropdownClosing(false);
    }, 150);
  }
  if (showSearchBarRef.current && !(forceSearchOpen || isStackedLayout)) {
      setShowSearchBar(false);
    }
    if (isFilterVisibleRef.current) {
      setIsFilterOpen(false);
      setTimeout(() => setIsFilterVisible(false), 150);
    }
}, [forceSearchOpen, isStackedLayout]);

  useEffect(() => {
    window.addEventListener('scroll', closeModalsOnScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', closeModalsOnScroll);
    };
  }, [closeModalsOnScroll]);

  // Close business dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideButtonWrap = businessDropdownRef.current?.contains(target);
      const clickedInsidePortalMenu = businessMenuPortalRef.current?.contains(target);

      if (!clickedInsideButtonWrap && !clickedInsidePortalMenu) {
        setIsBusinessDropdownOpen(false);
      }
    };

    if (isBusinessDropdownOpen) {
      // use 'click' instead of 'mousedown' so Link can process first
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isBusinessDropdownOpen]);

  // Close discover dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideButtonWrap = discoverDropdownRef.current?.contains(target);
      const clickedInsidePortalMenu = discoverMenuPortalRef.current?.contains(target);

      if (!clickedInsideButtonWrap && !clickedInsidePortalMenu) {
        setIsDiscoverDropdownClosing(true);
        setTimeout(() => {
          setIsDiscoverDropdownOpen(false);
          setIsDiscoverDropdownClosing(false);
        }, 200);
      }
    };

    if (isDiscoverDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDiscoverDropdownOpen]);

  // Measure button position when dropdown opens
  useLayoutEffect(() => {
    if (isBusinessDropdownOpen && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const dropdownWidth = 560; // min-w-[560px]
      const viewportWidth = window.innerWidth;
      const padding = 16; // padding from edge

      // Calculate left position, ensure it doesn't go off screen
      let leftPos = r.left;

      // If dropdown would go off right edge, align to right side of button
      if (leftPos + dropdownWidth > viewportWidth - padding) {
        leftPos = Math.max(padding, r.right - dropdownWidth);
      }

      // Ensure it doesn't go off left edge
      leftPos = Math.max(padding, leftPos);

      setMenuPos({ left: leftPos, top: r.bottom + 16 });
    }
  }, [isBusinessDropdownOpen]);

  useLayoutEffect(() => {
    if (isDiscoverDropdownOpen && discoverBtnRef.current) {
      const r = discoverBtnRef.current.getBoundingClientRect();
      const dropdownWidth = 320;
      const viewportWidth = window.innerWidth;
      const padding = 16;

      let leftPos = r.left;

      if (leftPos + dropdownWidth > viewportWidth - padding) {
        leftPos = Math.max(padding, r.right - dropdownWidth);
      }

      leftPos = Math.max(padding, leftPos);

      setDiscoverMenuPos({ left: leftPos, top: r.bottom + 12 });
    }
  }, [isDiscoverDropdownOpen]);


  const openFilters = () => {
    if (isFilterVisible) return;
    setIsFilterVisible(true);
    setTimeout(() => setIsFilterOpen(true), 10);
  };

  const closeFilters = () => {
    setIsFilterOpen(false);
    setTimeout(() => setIsFilterVisible(false), 150);
  };

  const handleApplyFilters = (f: FilterState) => {
    console.log("filters:", f);
  };

  // NEW: when user submits the query (Enter), we close the search bar (and filters if open)
  const handleSubmitQuery = (query: string) => {
    console.log("submit query:", query);
    if (!forceSearchOpen && !isStackedLayout) {
    setShowSearchBar(false);
    }
    if (isFilterVisible) closeFilters();
  };

  // Different positioning for home page (frosty variant) vs other pages
  const isHomeVariant = variant === "frosty";
  const computedBackgroundClass = backgroundClassName ?? "bg-off-white";
  const headerClassName = isHomeVariant
    ? `absolute top-8 mt-6 left-1/2 -translate-x-1/2 z-50 ${computedBackgroundClass} backdrop-blur-xl rounded-full shadow-lg border border-white/30 transition-all duration-300 w-[96%] max-w-[1700px] ${!isHeaderVisible ? 'opacity-0 pointer-events-none' : ''}`
    : `fixed ${topPosition} left-0 right-0 z-50 ${computedBackgroundClass} backdrop-blur-xl shadow-lg shadow-sage/5 transition-all duration-300 ${isHeaderVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`;
  const isSearchVisible = forceSearchOpen || isStackedLayout || showSearchBar;

  const handleSearchToggle = () => {
    if (forceSearchOpen || isStackedLayout) {
      return;
    }
    if (isHomeVariant) {
      router.push("/explore?openSearch=true");
      return;
    }
    setShowSearchBar((prev) => !prev);
  };

  const renderSearchInput = () => (
    <SearchInput
      variant="header"
      placeholder="Discover exceptional local experiences, premium dining, and hidden gems..."
      mobilePlaceholder="Search places, coffee, yoga…"
      onSearch={(q) => console.log("search change:", q)}
      onSubmitQuery={handleSubmitQuery}
      onFilterClick={openFilters}
      onFocusOpenFilters={openFilters}
      showFilter
    />
  );

  return (
    <>
      <header className={headerClassName} style={sf}>
        <div className={`relative z-[1] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 ${isHomeVariant ? 'py-0' : reducedPadding ? 'py-2 md:py-3' : 'py-4 md:py-6'}`}>
          {/* Top row */}
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <OptimizedLink href="/home" className="group flex-shrink-0 relative" aria-label="sayso Home">
              <div className="absolute inset-0 bg-gradient-to-r from-sage/30 to-coral/30 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative scale-[0.72] origin-left">
                <Logo variant="default" className="relative drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)]" />
              </div>
            </OptimizedLink>

            {/* Desktop nav - centered */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 flex-1 justify-center">
              {PRIMARY_LINKS.map(({ key, label, href }, index) => (
                <Fragment key={key}>
                <OptimizedLink
                    href={href}
                    className={`group capitalize px-2 lg:px-3 rounded-full text-xs font-normal transition-all duration-300 relative ${whiteText ? 'text-white hover:text-white/80' : 'text-charcoal/90 hover:text-charcoal/90'}`}
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sage/10 to-coral/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 backdrop-blur-sm bg-off-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">{label}</span>
                    {key === "saved" && (
                      <div
                        className={`absolute -top-1 -right-1 text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg z-20 ${
                          savedCount > 0 ? 'bg-off-white text-charcoal' : 'bg-off-white/60 text-charcoal/50'
                        }`}
                      >
                      {savedCount > 99 ? "99+" : savedCount}
                      </div>
                    )}
                  </OptimizedLink>

                  {index === 0 && (
                    <div className="relative" ref={discoverDropdownRef}>
                      <button
                        ref={discoverBtnRef}
                        onClick={() => {
                          if (isDiscoverDropdownOpen) {
                            setIsDiscoverDropdownClosing(true);
                            setTimeout(() => {
                              setIsDiscoverDropdownOpen(false);
                              setIsDiscoverDropdownClosing(false);
                            }, 200);
                          } else {
                            setIsDiscoverDropdownClosing(false);
                            setIsDiscoverDropdownOpen(true);
                          }
                        }}
                        className={`group capitalize px-3 lg:px-4 py-1 rounded-full text-xs font-normal transition-all duration-300 relative flex items-center gap-1 ${whiteText ? 'text-white hover:text-white/80' : 'text-charcoal/90 hover:text-charcoal/90'}`}
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                        aria-expanded={isDiscoverDropdownOpen}
                        aria-haspopup="true"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-sage/10 to-coral/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 backdrop-blur-sm bg-off-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10 whitespace-nowrap">Discover</span>
                        <ChevronDown className={`relative z-10 w-3 h-3 transition-transform duration-200 ${isDiscoverDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isDiscoverDropdownOpen &&
                        createPortal(
                          <div
                            ref={discoverMenuPortalRef}
                            className={`fixed z-[1000] bg-off-white rounded-2xl border border-white/60 shadow-xl overflow-hidden min-w-[320px] transition-all duration-300 ease-out ${
                              isDiscoverDropdownClosing ? 'opacity-0 scale-95 translate-y-[-8px]' : 'opacity-100 scale-100 translate-y-0'
                            }`}
                            style={{
                              left: discoverMenuPos.left,
                              top: discoverMenuPos.top,
                              fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                              animation: isDiscoverDropdownClosing ? 'none' : 'fadeInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="px-5 pt-4 pb-3 border-b border-charcoal/10 bg-off-white flex items-center gap-2">
                              <Compass className="w-4 h-4 text-sage" />
                              <span className="text-sm font-semibold text-charcoal">Discover</span>
                            </div>
                            <div className="py-3">
                              {DISCOVER_LINKS.map(({ key: subKey, label: subLabel, description, href: subHref }) => (
                                <OptimizedLink
                                  key={subKey}
                                  href={subHref}
                                  onClick={() => {
                                    setIsDiscoverDropdownClosing(true);
                                    setTimeout(() => {
                                      setIsDiscoverDropdownOpen(false);
                                      setIsDiscoverDropdownClosing(false);
                                    }, 200);
                                  }}
                                  className="group flex items-start gap-3 px-5 py-3 hover:bg-sage/10 transition-all duration-200"
                                  style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                                >
                                  <div className="mt-1 w-2 h-2 rounded-full bg-gradient-to-br from-sage to-coral/70 group-hover:scale-125 transition-transform" />
                                  <div className="flex-1">
                                    <div className="text-sm font-semibold text-charcoal group-hover:text-coral">{subLabel}</div>
                                    <div className="text-xs text-charcoal/60 mt-0.5">{description}</div>
                                  </div>
                                </OptimizedLink>
                              ))}
                            </div>
                          </div>,
                          document.body
                        )}
                    </div>
                  )}
                </Fragment>
              ))}

              {/* For Businesses Dropdown (desktop) */}
              <div className="relative" ref={businessDropdownRef}>
                <button
                  ref={btnRef}
                  onClick={() => {
                    if (isBusinessDropdownOpen) {
                      setIsBusinessDropdownClosing(true);
                      setTimeout(() => {
                        setIsBusinessDropdownOpen(false);
                        setIsBusinessDropdownClosing(false);
                      }, 300);
                    } else {
                      setIsBusinessDropdownOpen(true);
                    }
                  }}
                  className={`group capitalize px-3 lg:px-4 py-1 rounded-full text-xs font-normal transition-all duration-300 relative flex items-center gap-1 ${whiteText ? 'text-white hover:text-white/80' : 'text-charcoal/90 hover:text-charcoal/90'}`}
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sage/10 to-coral/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 backdrop-blur-sm bg-off-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 whitespace-nowrap">For Businesses</span>
                  <ChevronDown className={`relative z-10 w-3 h-3 transition-transform duration-200 ${isBusinessDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isBusinessDropdownOpen &&
                  createPortal(
                    <div
                      ref={businessMenuPortalRef}
                      className={`fixed z-[1000] bg-off-white rounded-2xl border border-white/60 shadow-xl overflow-hidden min-w-[560px] whitespace-normal break-keep transition-all duration-300 ease-out ${
                        isBusinessDropdownClosing ? 'opacity-0 scale-95 translate-y-[-8px]' : 'opacity-100 scale-100 translate-y-0'
                      }`}
                      style={{
                        left: menuPos.left,
                        top: menuPos.top + 12,
                        fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                        animation: isBusinessDropdownClosing ? 'none' : 'fadeInScale 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative flex items-center justify-between px-5 sm:px-6 pt-4 pb-3 border-b border-charcoal/10 bg-off-white">
                        <div className="relative z-10 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-sage" />
                          <h2 className="text-sm md:text-base font-semibold text-charcoal" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>For Businesses</h2>
                        </div>
                        <button
                          onClick={() => {
                            setIsBusinessDropdownClosing(true);
                            setTimeout(() => {
                              setIsBusinessDropdownOpen(false);
                              setIsBusinessDropdownClosing(false);
                            }, 300);
                          }}
                          className="relative z-10 w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-charcoal/10 bg-off-white/70 hover:bg-sage/10 hover:text-sage text-charcoal/80 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-sage/30 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                          aria-label="Close menu"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="px-5 sm:px-6 py-4 space-y-1.5" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                        {BUSINESS_LINKS.map(({ key, label, description, href }) => (
                          <OptimizedLink
                            key={key}
                            href={href}
                            className="group flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-sage/10 transition-all duration-200"
                          style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                        >
                            <div className="mt-1 w-2 h-2 rounded-full bg-gradient-to-br from-sage to-coral/70 group-hover:scale-125 transition-transform" />
                          <div className="flex-1">
                              <div className="text-sm font-semibold text-charcoal group-hover:text-coral transition-colors">
                                {label}
                          </div>
                              <div className="text-xs text-charcoal/60 mt-0.5">
                                {description}
                          </div>
                          </div>
                          </OptimizedLink>
                        ))}
                      </div>
                    </div>,
                    document.body
                  )}
              </div>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              {/* Search Toggle (manual close/open) */}
              {showSearch && !(forceSearchOpen || isStackedLayout) && (
              <button
                onClick={handleSearchToggle}
                className="group w-11 h-11 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-charcoal/90 hover:text-charcoal/90 transition-all duration-300 relative overflow-hidden min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                aria-label="Toggle search"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sage/20 to-coral/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 backdrop-blur-sm bg-off-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Search className="relative z-10 w-4 h-4" />
              </button>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-11 h-11 rounded-full flex items-center justify-center hover:bg-sage/10 transition-colors min-h-[44px] min-w-[44px]"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className={`w-5 h-5 ${whiteText ? 'text-white' : 'text-charcoal/90'}`} />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-[5px]">
                    <span className={`w-4 h-[2px] rounded-full ${whiteText ? 'bg-white' : 'bg-charcoal/90'}`} />
                    <span className={`w-4 h-[2px] rounded-full ${whiteText ? 'bg-white' : 'bg-charcoal/90'}`} />
                    <span className={`w-2 h-[2px] rounded-full ${whiteText ? 'bg-white' : 'bg-charcoal/90'}`} />
                  </div>
                )}
              </button>

              {/* Profile */}
              <OptimizedLink
                href="/profile"
                className={`group hidden md:flex w-6 h-6 rounded-full items-center justify-center transition-all duration-300 relative overflow-hidden md:min-h-[24px] md:min-w-[24px] ${whiteText ? 'text-white hover:text-white/80' : 'text-charcoal/90 hover:text-charcoal/90'}`}
                aria-label="Profile"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sage/20 to-coral/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 backdrop-blur-sm bg-off-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <User className="relative z-10 w-4 h-4" />
              </OptimizedLink>
            </div>
          </div>
        </div>
        {showSearch && isStackedLayout && isSearchVisible && (
          <div className="pt-4 pb-5" ref={searchWrapRef}>
            {renderSearchInput()}
          </div>
        )}
      </header>

      {/* Search Input Section — appears below navbar */}
      {showSearch && !isStackedLayout && (
        <div
          className={`fixed left-0 right-0 z-40 bg-transparent transition-all duration-300 ease-out ${
            isHomeVariant 
              ? (isSearchVisible ? "top-[calc(6rem+12px)] opacity-100 translate-y-0" : "top-[calc(6rem+12px)] opacity-0 -translate-y-4 pointer-events-none")
              : (isSearchVisible ? "top-[72px] opacity-100 translate-y-0" : "top-[72px] opacity-0 -translate-y-4 pointer-events-none")
          }`}
          style={sf}
        >
          <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 max-w-[1300px]">
            {/* Anchor for the dropdown modal */}
            <div ref={searchWrapRef}>
              {renderSearchInput()}
            </div>
          </div>
        </div>
      )}

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-xl z-[10000] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-off-white z-[99999] shadow-lg shadow-sage/10 transform md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between px-6 py-6 border-b border-charcoal/10 flex-shrink-0">
            <Logo variant="mobile" />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-11 h-11 rounded-full flex items-center justify-center hover:bg-sage/10 group min-h-[44px] min-w-[44px] ${isHomeVariant ? 'text-charcoal' : 'text-charcoal/90'}`}
              aria-label="Close menu"
            >
              <X className={`w-6 h-6 ${isHomeVariant ? 'text-charcoal' : 'text-charcoal/90'} group-hover:text-sage transition-colors`} />
            </button>
          </div>

          <nav className="flex flex-col py-4 px-4 overflow-y-auto flex-1 min-h-0">
            {PRIMARY_LINKS.map(({ key, label, href }) => (
              <OptimizedLink
                key={key}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold text-charcoal hover:text-charcoal hover:bg-sage/5 transition-colors relative min-h-[44px] flex items-center"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
              >
                <span className="flex items-center justify-between">
                  {label}
                  {key === "saved" && (
                    <div
                      className={`${savedCount === 0 ? 'bg-off-white/60 text-charcoal/50' : 'bg-off-white text-charcoal'} text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 shadow-lg`}
                    >
                      {savedCount > 99 ? "99+" : savedCount}
                    </div>
                  )}
                </span>
              </OptimizedLink>
            ))}

            <div className="h-px bg-charcoal/10 my-4 mx-4" />

            <div className="px-4 py-2">
              <div className="flex items-center gap-2 mb-2">
                <Compass className="w-4 h-4 text-sage" />
                <span className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Discover</span>
              </div>
              <div className="space-y-2">
                {DISCOVER_LINKS.map(({ key, label, href }) => (
                  <OptimizedLink
                    key={key}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-semibold text-charcoal/90 hover:text-charcoal/90 hover:bg-sage/5 transition-all duration-200 min-h-[44px] flex gap-3"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                  >
                    <span className="mt-1 w-2 h-2 rounded-full bg-gradient-to-br from-sage to-coral/70 flex-shrink-0" />
                    <span className="flex-1 text-left">{label}</span>
                  </OptimizedLink>
                ))}
              </div>
            </div>
            
            <div className="h-px bg-charcoal/10 my-4 mx-4" />
            
            {/* For Businesses Section */}
            <div className="px-4 py-2">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-sage" />
                <span className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">For Businesses</span>
              </div>
              <div className="space-y-2">
                {BUSINESS_LINKS.map(({ key, label, description, href }) => (
            <OptimizedLink
                key={key}
                href={href}
              onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-charcoal/90 hover:text-charcoal/90 hover:bg-sage/5 transition-all duration-200 min-h-[44px] flex gap-3"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
            >
                  <span className="mt-1 w-2 h-2 rounded-full bg-gradient-to-br from-sage to-coral/70 flex-shrink-0" />
                  <span className="flex-1 text-left">
                    <span className="block">{label}</span>
                    <span className="text-xs font-normal text-charcoal/60">{description}</span>
                  </span>
            </OptimizedLink>
                ))}
              </div>
            </div>
            
            <div className="h-px bg-charcoal/10 my-4 mx-4" />
            <OptimizedLink
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-semibold text-charcoal/90 hover:text-charcoal/90 hover:bg-sage/5 flex items-center gap-3 transition-all duration-200 min-h-[44px]"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
            >
              Profile
            </OptimizedLink>
          </nav>
        </div>
      </div>


      {/* Anchored Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        isVisible={isFilterVisible}
        onClose={closeFilters}
        onApplyFilters={handleApplyFilters}
        anchorRef={searchWrapRef}
      />
    </>
  );
}
