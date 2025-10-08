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
`;

export default function OnboardingPage() {
  const mounted = useMounted();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="min-h-[100dvh]  bg-white   flex flex-col items-center justify-center px-4 py-4 md:py-8 relative overflow-hidden safe-area-padding">

        <div className="w-full max-w-full px-3 md:max-w-4xl md:px-4 mx-auto relative z-10 max-h-screen overflow-y-auto ios-inertia hide-scrollbar flex flex-col justify-center min-h-0">
          {/* App Name */}
          <div className="text-center mb-4 opacity-0 animate-fade-in-up delay-400">
            <div className="inline-block relative">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-charcoal mb-1 md:mb-1.5 relative tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }} suppressHydrationWarning>
                KLIO
              </h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center mb-4">
            <div className="opacity-0 animate-fade-in-up delay-600">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-charcoal mb-4 text-center leading-tight px-1 md:px-2 tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }} suppressHydrationWarning>
                Discover local gems near you!
              </h2>
            </div>

            <div className="opacity-0 animate-fade-in-up delay-800">
              <p className="text-base md:text-lg font-normal text-charcoal/70 mb-4 leading-relaxed px-2 md:px-4 max-w-sm md:max-w-lg lg:max-w-2xl mx-auto" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }} suppressHydrationWarning>
                From restaurants to plumbers, find trusted businesses reviewed by us South Africans
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-4 max-w-xs md:max-w-md mx-auto">
              <div className="opacity-0 animate-fade-in-up delay-1000">
                <Link
                  href="/register"
                  className="group relative block w-[200px] mx-auto rounded-full py-3 px-2 md:px-4
               text-base font-semibold text-charcoal text-center flex items-center justify-center
               backdrop-blur-xl bg-gradient-to-br from-sage/40 via-sage/30 to-coral/20
               border border-white/20 shadow-lg
               transition-all duration-500 ease-out
               hover:scale-[1.04] hover:shadow-xl hover:border-white/40 hover:from-sage/50 hover:to-sage/30"
                  style={{
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  {/* Frosted glass reflection top layer */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/15 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 blur-[3px]" />

                  {/* Animated subtle shine sweep */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />

                  {/* Text that changes color on hover */}
                  <span className="relative z-10 tracking-wide transition-colors duration-500 ease-out group-hover:text-coral">
                    Get Started
                  </span>
                </Link>
              </div>



              <div className="opacity-0 animate-fade-in-up delay-1200">
                <Link
                  href="/login"
                  className="group block w-full text-coral hover:text-coral/80 text-base font-semibold min-h-[48px] py-3 px-6 transition-all duration-300 focus:outline-none relative text-center flex items-center justify-center"
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
            <div className="flex flex-col items-center gap-1 w-14 md:w-16 opacity-0 animate-scale-in delay-1400">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-sage/10 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-sage rounded-full" />
              </div>
              <span className="text-[9px] md:text-[10px] font-medium tracking-tight leading-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Earn points</span>
            </div>

            <div className="flex flex-col items-center gap-1 w-14 md:w-16 opacity-0 animate-scale-in delay-1600">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-coral/10 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-coral rounded-full" />
              </div>
              <span className="text-[9px] md:text-[10px] font-medium tracking-tight leading-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Trusted opinions</span>
            </div>

            <div className="flex flex-col items-center gap-1 w-14 md:w-16 opacity-0 animate-scale-in delay-1800">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-charcoal/10 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-charcoal rounded-full" />
              </div>
              <span className="text-[9px] md:text-[10px] font-medium tracking-tight leading-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Community favourites</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}