"use client";

import Link from "next/link";
import { useMounted } from "../hooks/useMounted";

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

  .delay-400 { animation-delay: .4s }
  .delay-600 { animation-delay: .6s }
  .delay-800 { animation-delay: .8s }
  .delay-1000 { animation-delay: 1s }

  @keyframes shimmerSweep {
    0% { background-position: -150% 0; opacity: .2; }
    50% { opacity: .6; }
    100% { background-position: 150% 0; opacity: .2; }
  }
  .shimmer-overlay {
    position: relative;
    color: #222222;
    display: inline-block;
  }
  .shimmer-overlay::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      transparent 0%,
      rgba(255,255,255,0.35) 45%,
      rgba(180,180,180,0.25) 50%,
      transparent 55%
    );
    background-size: 200% 100%;
    animation: shimmerSweep 4s ease-in-out infinite;
    mix-blend-mode: lighten;
    pointer-events: none;
    border-radius: 0.25rem;
  }

  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }

  .safe-area-padding {
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
  .ios-inertia { -webkit-overflow-scrolling: touch; overscroll-behavior: contain; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .hide-scrollbar::-webkit-scrollbar { display: none; }

  .btn-press:active { transform: scale(0.98); transition: transform 0.1s ease; }

  .btn-premium {
    position: relative;
    background: linear-gradient(135deg, #7D9B76 0%, #6B8A64 100%);
    box-shadow:
      0 10px 40px rgba(125,155,118,0.25),
      0 4px 12px rgba(0,0,0,0.08),
      inset 0 1px 0 rgba(255,255,255,0.15);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
  }
  .btn-premium:hover {
    transform: translateY(-2px);
    box-shadow:
      0 20px 60px rgba(125,155,118,0.35),
      0 8px 24px rgba(0,0,0,0.12),
      inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .btn-premium:active { transform: translateY(0); }

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
      <div className="min-h-[100svh] md:min-h-[100dvh] bg-white flex flex-col items-center justify-center px-4 py-4 md:py-8 relative overflow-hidden safe-area-padding">

        {/* Content only — background objects removed */}
        <div className="w-full max-w-full px-3 md:max-w-4xl md:px-4 mx-auto relative z-10 flex flex-col h-full py-4 sm:py-6">
          {/* Logo */}
          <div className={`text-center mb-8 md:mb-6 flex-shrink-0 ${mounted ? "opacity-0 animate-fade-in-up delay-400" : "opacity-0"}`}>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-charcoal tracking-tight">KLIO</h1>
          </div>

          {/* Main content */}
          <div className="text-center flex-1 flex flex-col justify-center min-h-0 py-4">
            <div className="space-y-6 md:space-y-8">
              <div className={`${mounted ? "opacity-0 animate-fade-in-up delay-600" : "opacity-0"}`}>
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 md:mb-6 leading-tight tracking-tight px-2 text-charcoal"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont,"SF Pro Display","SF Pro Text",system-ui,sans-serif' }}
                >
                  Discover local gems near you!
                </h2>
              </div>

              <div className={`${mounted ? "opacity-0 animate-fade-in-up delay-800" : "opacity-0"}`}>
                <p className="text-base md:text-lg font-normal text-charcoal/70 leading-relaxed max-w-sm md:max-w-lg lg:max-w-xl mx-auto px-4">
                   Explore trusted businesses, leave reviews and see what's trending around you
                </p>
              </div>

              <div className="space-y-3 md:space-y-4 max-w-xs md:max-w-md mx-auto pt-2 md:pt-4">
                <div className={`${mounted ? "opacity-0 animate-fade-in-up delay-1000" : "opacity-0"}`}>
                  <Link
                    href="/register"
                    className="group relative block w-[200px] mx-auto rounded-full py-3 text-base font-semibold text-white text-center flex items-center justify-center bg-sage shadow-lg btn-press transition-all duration-500 ease-out hover:scale-[1.04] hover:shadow-xl hover:bg-coral focus:outline-none focus-visible:ring-4 focus-visible:ring-sage/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    <span className="relative z-10 tracking-wide">Get Started</span>
                  </Link>
                </div>

                <div className={`${mounted ? "opacity-0 animate-fade-in-up delay-1200" : "opacity-0"}`}>
                  <Link
                    href="/login"
                    className="group block w-full text-coral hover:text-coral/80 text-base font-semibold min-h-[48px] py-3 px-6 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-sage/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white relative text-center flex items-center justify-center"
                  >
                    <span className="relative z-10">
                      Log in
                      <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-coral scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex justify-center items-start gap-3 md:gap-5 text-charcoal/60 text-center pt-8 md:pt-6 pb-4 flex-shrink-0">
            <div className={`${mounted ? "opacity-0 animate-scale-in delay-1400" : "opacity-0"} flex flex-col items-center gap-1 w-16 md:w-20`}>
              <div className="w-7 h-7 bg-sage/10 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-sage rounded-full" />
              </div>
              <span className="text-[9px] font-medium tracking-tight leading-tight whitespace-nowrap">Earn points</span>
            </div>
            <div className={`${mounted ? "opacity-0 animate-scale-in delay-1600" : "opacity-0"} flex flex-col items-center gap-1 w-16 md:w-20`}>
              <div className="w-7 h-7 bg-coral/10 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-coral rounded-full" />
              </div>
              <span className="text-[9px] font-medium tracking-tight leading-tight whitespace-nowrap">Trusted opinions</span>
            </div>
            <div className={`${mounted ? "opacity-0 animate-scale-in delay-1800" : "opacity-0"} flex flex-col items-center gap-1 w-20 md:w-24`}>
              <div className="w-7 h-7 bg-charcoal/10 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-charcoal rounded-full" />
              </div>
              <span className="text-[9px] font-medium tracking-tight leading-tight whitespace-nowrap">Community favourites</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
