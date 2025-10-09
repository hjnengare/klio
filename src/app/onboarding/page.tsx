"use client";

import Link from "next/link";
import { useMounted } from "../hooks/useMounted";

// Mobile-first CSS with proper typography scale and safe areas
const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
  .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }

  .delay-200 { animation-delay: 0.2s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-600 { animation-delay: 0.6s; }
  .delay-800 { animation-delay: 0.8s; }
  .delay-1000 { animation-delay: 1s; }
  .delay-1200 { animation-delay: 1.2s; }
  .delay-1400 { animation-delay: 1.4s; }
  .delay-1600 { animation-delay: 1.6s; }

  /* Reduced-motion: disable animations & transitions */
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }

  /* Safe area support for mobile devices */
  .safe-area-padding {
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }

  /* iOS inertia scrolling */
  .ios-inertia {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  /* Hide scrollbar */
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }

  /* Button press states */
  .btn-press:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }

  /* Premium button styling */
  .btn-premium {
    position: relative;
    background: linear-gradient(135deg, #7D9B76 0%, #6B8A64 100%);
    box-shadow:
      0 10px 40px rgba(125, 155, 118, 0.25),
      0 4px 12px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
  }
  .btn-premium:hover {
    transform: translateY(-2px);
    box-shadow:
      0 20px 60px rgba(125, 155, 118, 0.35),
      0 8px 24px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  .btn-premium:active {
    transform: translateY(0);
  }

  /* Card styling - border-first, tiny shadow */
  .card-mobile {
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  /* Input styling - 16px+ to prevent zoom */
  .input-mobile {
    font-size: 1rem;
    min-height: 44px;
  }

  /* Strong, contrast-safe focus ring */
  :focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px rgba(104,163,130,0.40), 0 0 0 6px #ffffff;
  }
`;

export default function OnboardingPage() {
  const mounted = useMounted();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      {/* safer viewport units: svh fallback on small screens, dvh for modern */}
      <div className="min-h-[100svh] md:min-h-[100dvh] bg-white flex flex-col items-center justify-center px-4 py-4 md:py-8 relative overflow-hidden safe-area-padding">

        {/* Geometric Background Shapes (decorative only) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Top-right coral circle - hanging glow */}
          <div className="absolute -top-10 -right-10 md:-top-16 md:-right-16 w-48 h-48 md:w-72 md:h-72 rounded-full bg-gradient-to-b from-coral/30 to-coral/5 blur-lg md:blur-2xl opacity-80" />

          {/* Top-right sage triangle - hanging upside down from corner */}
          <div className="absolute top-0 right-0 w-40 h-40 md:w-56 md:h-56 opacity-50">
            <div
              className="w-full h-full bg-gradient-to-b from-sage/50 to-sage/10 blur-md md:blur-xl rotate-180"
              style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
            />
          </div>

          {/* Bottom-left sage circle - larger and more visible */}
          <div className="absolute -bottom-16 -left-16 md:-bottom-24 md:-left-24 w-56 h-56 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-sage/35 to-sage/10 blur-lg md:blur-2xl opacity-75" />

          {/* Bottom-left coral rounded square - visible and soft */}
          <div className="absolute bottom-16 left-8 md:bottom-24 md:left-16 w-32 h-32 md:w-44 md:h-44 rounded-3xl bg-gradient-to-tl from-coral/40 to-coral/15 blur-md md:blur-xl opacity-60 rotate-12" />

          {/* Bottom-right sage rectangle - matched to triangle's style */}
          <div className="absolute bottom-8 right-4 md:bottom-12 md:right-8 w-28 h-48 md:w-36 md:h-64 opacity-50">
            <div
              className="w-full h-full bg-gradient-to-t from-sage/50 to-sage/10 blur-md md:blur-xl -rotate-6"
              style={{ clipPath: "inset(0% round 1rem)" }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="w-full max-w-full px-3 md:max-w-4xl md:px-4 mx-auto relative z-10 max-h-screen overflow-y-auto ios-inertia hide-scrollbar flex flex-col justify-center min-h-0 pb-6 sm:pb-8">
          {/* App Name */}
          <div className={`text-center mb-4 ${mounted ? "opacity-0 animate-fade-in-up delay-400" : "opacity-0"}`}>
            <div className="inline-block relative">
              <h1
                className="text-xl md:text-2xl lg:text-3xl font-bold text-charcoal mb-1 md:mb-1.5 relative tracking-tight"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                suppressHydrationWarning
              >
                KLIO
              </h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center mb-4">
            <div className={`${mounted ? "opacity-0 animate-fade-in-up delay-600" : "opacity-0"}`}>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-charcoal mb-4 text-center leading-tight px-1 md:px-2 tracking-tight"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                suppressHydrationWarning
              >
                Discover local gems near you!
              </h2>
            </div>

            <div className={`${mounted ? "opacity-0 animate-fade-in-up delay-800" : "opacity-0"}`}>
              <p
                className="text-base md:text-lg font-normal text-charcoal/70 mb-4 leading-relaxed px-2 md:px-4 max-w-sm md:max-w-lg lg:max-w-2xl mx-auto"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                suppressHydrationWarning
              >
                From restaurants to plumbers, find trusted businesses reviewed by us South Africans
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-4 max-w-xs md:max-w-md mx-auto">
              <div className={`${mounted ? "opacity-0 animate-fade-in-up delay-1000" : "opacity-0"}`}>
                <Link
                  href="/register"
                  prefetch
                  aria-label="Create a new KLIO account"
                  className="group relative block w-[200px] mx-auto rounded-full py-3 px-2 md:px-4
                             text-base font-semibold text-white text-center flex items-center justify-center
                             bg-sage shadow-lg btn-press
                             transition-all duration-500 ease-out
                             hover:scale-[1.04] hover:shadow-xl hover:bg-coral
                             focus:outline-none focus-visible:ring-4 focus-visible:ring-sage/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                >
                  <span className="relative z-10 tracking-wide">Get Started</span>
                </Link>
              </div>

              <div className={`${mounted ? "opacity-0 animate-fade-in-up delay-1200" : "opacity-0"}`}>
                <Link
                  href="/login"
                  prefetch
                  aria-label="Log in to your KLIO account"
                  className="group block w-full text-coral hover:text-coral/80 text-base font-semibold min-h-[48px] py-3 px-6 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-sage/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white relative text-center flex items-center justify-center"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                >
                  <span className="relative z-10">
                    Log in
                    <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-coral scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center" />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex justify-center items-start gap-3 md:gap-5 text-charcoal/60 text-center px-2 md:px-4">
            <div className={`${mounted ? "opacity-0 animate-scale-in delay-1400" : "opacity-0"} flex flex-col items-center gap-1 w-14 md:w-16`}>
              <div className="w-7 h-7 md:w-8 md:h-8 bg-sage/10 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-sage rounded-full" />
              </div>
              <span
                className="text-[9px] md:text-[10px] font-medium tracking-tight leading-tight"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
              >
                Earn points
              </span>
            </div>

            <div className={`${mounted ? "opacity-0 animate-scale-in delay-1600" : "opacity-0"} flex flex-col items-center gap-1 w-14 md:w-16`}>
              <div className="w-7 h-7 md:w-8 md:h-8 bg-coral/10 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-coral rounded-full" />
              </div>
              <span
                className="text-[9px] md:text-[10px] font-medium tracking-tight leading-tight"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
              >
                Trusted opinions
              </span>
            </div>

            <div className={`${mounted ? "opacity-0 animate-scale-in delay-1800" : "opacity-0"} flex flex-col items-center gap-1 w-14 md:w-16`}>
              <div className="w-7 h-7 md:w-8 md:h-8 bg-charcoal/10 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-charcoal rounded-full" />
              </div>
              <span
                className="text-[9px] md:text-[10px] font-medium tracking-tight leading-tight"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
              >
                Community favourites
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
