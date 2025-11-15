"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useMounted } from "../hooks/useMounted";
import Logo from "../components/Logo/Logo";
import OnboardingCarousel from "../components/Onboarding/OnboardingCarousel";

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

  .no-hyphens {
    hyphens: none;
    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    word-break: normal;
    overflow-wrap: break-word;
  }
`;

export default function OnboardingPage() {
  const mounted = useMounted();

  useEffect(() => {
    document.title = "Onboarding - sayso";
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="min-h-[100svh] md:min-h-[100dvh] bg-off-white flex flex-col items-center justify-center px-4 py-4 md:py-8 relative overflow-hidden safe-area-padding no-overflow">

        {/* Content only — background objects removed */}
        <div className="w-full mx-auto max-w-[2000px] px-4 sm:px-6 lg:px-8 2xl:px-16 relative z-10 flex flex-col h-full py-4 sm:py-6">
          {/* Logo */}
          <div className={`text-center mb-8 md:mb-6 flex-shrink-0 flex justify-center ${mounted ? "opacity-0 animate-fade-in-up delay-400" : "opacity-0"}`}>
            <Logo variant="onboarding" />
          </div>

          {/* Main content */}
          <div className="text-center flex-1 flex flex-col justify-center min-h-0 py-4">
            <div className="space-y-6 md:space-y-8">
              <div className={`${mounted ? "opacity-0 animate-fade-in-up delay-600" : "opacity-0"}`}>
                <h2
                  className="text-4xl md:text-5xl font-bold mb-5 md:mb-6 leading-tight tracking-tight px-2 text-charcoal no-hyphens"
                  style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
                >
                  Discover local gems near you!
                </h2>
              </div>

              <div className={`${mounted ? "opacity-0 animate-fade-in-up delay-800" : "opacity-0"}`}>
                <p className="text-base md:text-lg font-normal text-charcoal/70 leading-relaxed max-w-sm md:max-w-lg lg:max-w-xl mx-auto px-4 no-hyphens"
                   style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 400 }}>
                   Explore trusted businesses, leave reviews and see what&apos;s trending around you
                </p>
              </div>

              <div className="space-y-3 md:space-y-4 max-w-xs md:max-w-md mx-auto pt-2 md:pt-4">
                <div className={`${mounted ? "opacity-0 animate-fade-in-up delay-1000" : "opacity-0"}`}>
                  <Link
                    href="/register"
                    className="group relative block w-[200px] mx-auto rounded-full py-4 px-4 text-sm font-600 text-white text-center flex items-center justify-center bg-gradient-to-r from-coral to-coral/80 hover:from-sage hover:to-sage transition-all duration-300 btn-target btn-press focus:outline-none focus-visible:ring-4 focus-visible:ring-sage/30 focus-visible:ring-offset-2"
                    style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}
                  >
                    <span className="relative z-10">Get Started</span>
                  </Link>
                </div>

                <div className={`${mounted ? "opacity-0 animate-fade-in-up delay-1200" : "opacity-0"}`}>
                  <Link
                    href="/login"
                    className="block w-full text-coral hover:text-sage text-sm font-600 min-h-[48px] py-3 px-6 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-sage/30 focus-visible:ring-offset-2 relative text-center flex items-center justify-center"
                    style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

