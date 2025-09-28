"use client";

import Link from "next/link";
import { useEffect } from "react";
import confetti from "canvas-confetti";
// import { useAuth } from "../contexts/AuthContext"; // Disabled for UI/UX design
import { useReducedMotion } from "../utils/useReducedMotion";
import OnboardingLayout from "../components/Onboarding/OnboardingLayout";

// Additional CSS animations for complete page
const completeStyles = `
  @keyframes float {
    0% { transform: translateY(0) scale(.95); opacity: 0; }
    10% { opacity: 1; }
    50% { transform: translateY(-40%) scale(1); }
    90% { opacity: 1; }
    100% { transform: translateY(-90%) scale(.95); opacity: 0; }
  }
  .float-anim { animation: float 4s ease-in-out infinite; }
  .float-anim.delay-400 { animation-delay: .4s; }
  .float-anim.delay-800 { animation-delay: .8s; }

  @media (prefers-reduced-motion: reduce) {
    .float-anim { animation: none !important; }
  }
`;

export default function CompletePage() {
  // const { updateUser, user } = useAuth(); // Disabled for UI/UX design
  const user = { id: 'dummy-user-id' }; // Dummy user for UI/UX design
  const updateUser = () => {}; // Dummy function for UI/UX design
  const reducedMotion = useReducedMotion();
  
  useEffect(() => {
    // Mark onboarding as complete - disabled for UI/UX design
    // updateUser({
    //   profile: {
    //     ...user?.profile,
    //     onboarding_complete: true,
    //     onboarding_step: 'complete',
    //     interests: user?.profile?.interests || [],
    //     sub_interests: user?.profile?.sub_interests || [],
    //     dealbreakers: user?.profile?.dealbreakers || [],
    //     created_at: user?.profile?.created_at || new Date().toISOString(),
    //     updated_at: new Date().toISOString(),
    //     id: user?.id || ''
    //   }
    // });

    // Rain confetti effect on mount (respect reduced motion)
    if (!reducedMotion) {
      let cancelled = false;
      const duration = 2 * 1000; // 2 seconds
      const end = Date.now() + duration;

      (function frame() {
        if (cancelled) return;

        // left side
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["var(--coral)", "var(--sage)", "var(--charcoal)", "var(--off-white)"],
        });
        // right side
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["var(--coral)", "var(--sage)", "var(--charcoal)", "var(--off-white)"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();

      return () => { cancelled = true; };
    }
  }, [updateUser, reducedMotion]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: completeStyles }} />
      <OnboardingLayout step={4} showProgress={false}>
        <div
          className="text-center animate-fade-in-up flex-1 flex flex-col justify-center"
          style={{
            // CSS variables for consistent design tokens
            "--coral": "hsl(16, 100%, 66%)",
            "--sage": "hsl(148, 20%, 38%)",
            "--charcoal": "hsl(0, 0%, 25%)",
            "--off-white": "hsl(0, 0%, 98%)",
          } as React.CSSProperties}
        >
          {/* Headline & subhead */}
          <h1 className="font-urbanist text-3xl md:text-5xl lg:text-6xl font-700 text-charcoal mb-4 animate-fade-in-up" aria-live="polite">
            You&apos;re all set!
          </h1>
          <p className="font-urbanist text-base md:text-lg font-400 text-charcoal/70 mb-4 animate-fade-in-up delay-200">
            Time to discover what&apos;s out there.
          </p>

          {/* Small moving graphic */}
          <div className="relative mx-auto mb-4 h-28 w-full max-w-[420px] animate-fade-in-up delay-300" aria-hidden="true">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute bottom-0 left-[15%] w-14 h-14 rounded-full bg-off-white border-2 border-coral flex items-center justify-center float-anim">
                <ion-icon name="happy-outline" style={{ fontSize: 22, color: "var(--charcoal)" }} aria-hidden="true" />
              </div>
              <div className="absolute bottom-0 left-[45%] w-14 h-14 rounded-full bg-off-white border-2 border-sage flex items-center justify-center float-anim delay-400">
                <ion-icon name="sparkles-outline" style={{ fontSize: 22, color: "var(--charcoal)" }} aria-hidden="true" />
              </div>
              <div className="absolute bottom-0 left-[75%] w-14 h-14 rounded-full bg-off-white border-2 border-coral flex items-center justify-center float-anim delay-800">
                <ion-icon name="checkmark-outline" style={{ fontSize: 22, color: "var(--charcoal)" }} aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="animate-fade-in-up delay-400">
            <Link
              href="/home"
              data-testid="onboarding-complete-cta"
              aria-label="Go to Home"
              className="group inline-block w-full sm:w-auto bg-sage text-white font-urbanist text-sm font-600 py-4 px-8 rounded-full shadow-lg transition-[transform,background-color,box-shadow] duration-300 hover:scale-[1.03] hover:bg-coral focus:bg-coral focus:outline-none focus:ring-4 focus:ring-coral/30 focus:ring-offset-2"
            >
              Continue to Home
              <ion-icon name="arrow-forward" size="small" class="ml-2" />
            </Link>
          </div>

          {/* Completion indicator */}
          <div className="mt-8 animate-fade-in-up delay-500">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage/10 border border-sage/30 rounded-full">
              <ion-icon name="checkmark-circle" style={{ color: "var(--sage)", fontSize: "16px" }} />
              <span className="font-urbanist text-xs font-600 text-sage">Setup Complete</span>
            </div>
          </div>
        </div>
      </OnboardingLayout>
    </>
  );
}
