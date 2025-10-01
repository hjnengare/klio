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

  /* Button press states */
  .btn-press:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
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
      <div className="min-h-[100dvh] bg-white/90 flex flex-col items-center justify-center px-4 py-4 md:py-8 relative overflow-hidden safe-area-padding">

        {/* Lightweight decorative elements - optimized for mobile */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-12 left-4 w-24 h-24 md:top-20 md:left-10 md:w-40 md:h-40 bg-gradient-to-br from-sage/30 to-sage/80 rounded-full blur-3xl opacity-0 animate-fade-in-up delay-200" />
          <div className="absolute bottom-16 right-6 w-32 h-32 md:bottom-32 md:right-16 md:w-56 md:h-56 bg-gradient-to-br from-coral/25 to-coral/80 rounded-full blur-3xl opacity-0 animate-fade-in-up delay-400" />
          <div className="absolute top-1/2 left-1/4 w-20 h-20 md:left-1/3 md:w-32 md:h-32 bg-gradient-to-br from-charcoal/20 to-charcoal/20 rounded-full blur-2xl opacity-0 animate-fade-in-up delay-600" />
        </div>

        <div className="w-full max-w-full px-3 md:max-w-4xl md:px-4 mx-auto relative z-10 max-h-screen overflow-y-auto ios-inertia flex flex-col justify-center min-h-0">
          {/* App Name */}
          <div className="text-center mb-4 opacity-0 animate-fade-in-up delay-400">
            <div className="inline-block relative">
              <h1 className="font-urbanist text-xl md:text-2xl lg:text-3xl font-700 text-charcoal mb-1 md:mb-1.5 relative tracking-tight" suppressHydrationWarning>
                KLIO
              </h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center mb-4">
            <div className="opacity-0 animate-fade-in-up delay-600">
              <h2 className="font-urbanist text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-700 text-charcoal mb-4 text-center leading-tight px-1 md:px-2 tracking-[0.01em]" suppressHydrationWarning>
                Discover trusted local gems near you!
              </h2>
            </div>

            <div className="opacity-0 animate-fade-in-up delay-800">
              <p className="font-urbanist text-base md:text-lg font-400 text-charcoal/70 mb-4 leading-relaxed px-2 md:px-4 max-w-sm md:max-w-lg lg:max-w-2xl mx-auto" suppressHydrationWarning>
                Let&apos;s find your new favourite spot and connect with authentic experiences in your community
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-4 max-w-xs md:max-w-md mx-auto">
              <div className="opacity-0 animate-fade-in-up delay-1000">
                <Link
                  href="/register"
                  className="group block w-full rounded-full bg-gradient-to-r from-sage to-sage/90 hover:from-coral hover:to-coral/90 text-white font-urbanist text-base font-600 min-h-[48px] py-3 px-6 rounded-6 shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sage/20 hover:focus:ring-coral/20 focus:ring-offset-1 relative overflow-hidden text-center hover:scale-[1.02] btn-press flex items-center justify-center"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-coral to-coral/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </div>

              <div className="opacity-0 animate-fade-in-up delay-1200">
                <Link
                  href="/login"
                  className="group block w-full text-coral hover:text-coral/80 font-urbanist text-base font-600 min-h-[48px] py-3 px-6 transition-all duration-300 focus:outline-none relative text-center hover:scale-[1.01] btn-press flex items-center justify-center"
                >
                  <span className="relative z-10">Log in</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex justify-center items-center space-x-4 md:space-x-6 lg:space-x-10 text-charcoal/60 text-center px-2 md:px-4">
            <div className="flex flex-col items-center space-y-1 md:space-y-1.5 lg:space-y-2 opacity-0 animate-scale-in delay-1400">
              <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-sage/10 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 bg-sage rounded-full" />
              </div>
              <span className="font-urbanist text-base font-500 tracking-tight min-w-0">Trusted</span>
            </div>

            <div className="flex flex-col items-center space-y-1 md:space-y-1.5 lg:space-y-2 opacity-0 animate-scale-in delay-1600">
              <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-coral/10 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 bg-coral rounded-full" />
              </div>
              <span className="font-urbanist text-base font-500 tracking-tight min-w-0">Local</span>
            </div>

            <div className="flex flex-col items-center space-y-1 md:space-y-1.5 lg:space-y-2 opacity-0 animate-scale-in delay-1800">
              <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-charcoal/10 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 bg-charcoal rounded-full" />
              </div>
              <span className="font-urbanist text-base font-500 tracking-tight min-w-0">Authentic</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}