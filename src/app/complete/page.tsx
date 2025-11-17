"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useScrollReveal } from "../hooks/useScrollReveal";
import Logo from "../components/Logo/Logo";
import { CheckCircle } from "react-feather";

export default function CompletePage() {
  const router = useRouter();
  const { user } = useAuth();

  // Initialize scroll reveal
  useScrollReveal({ threshold: 0.1, rootMargin: "0px 0px -50px 0px", once: true });

  // Redirect to home after a short delay if onboarding is complete
  useEffect(() => {
    if (user?.profile?.onboarding_complete) {
      const timer = setTimeout(() => {
        router.push("/home");
      }, 3000); // Show success message for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [user, router]);

  return (
    <div className="min-h-[100dvh] bg-off-white flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="w-full mx-auto max-w-[2000px] px-4 sm:px-6 lg:px-8 2xl:px-16 relative z-10 flex flex-col items-center justify-center">
        <section data-section>
          <div className="text-center space-y-6 max-w-2xl">
            {/* Logo */}
            <div className="mb-8">
              <Logo />
            </div>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-sage to-sage/80 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-white" strokeWidth={2.5} />
              </div>
            </div>

            {/* Heading */}
            <h1
              className="text-4xl md:text-5xl font-semibold text-charcoal mb-4 leading-[1.2] tracking-tight"
              style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
            >
              You're all set! 🎉
            </h1>

            {/* Subtitle */}
            <p
              className="text-body font-normal text-charcoal/70 max-w-[70ch] mx-auto leading-relaxed"
              style={{ fontFamily: 'Urbanist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
            >
              Welcome to sayso! Your profile is complete and you're ready to discover amazing local businesses, share honest reviews, and connect with your community.
            </p>

            {/* CTA Button */}
            <div className="pt-6">
              <button
                onClick={() => router.push("/home")}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-coral to-coral/80 text-white rounded-full text-body font-semibold hover:from-coral/90 hover:to-coral transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ fontFamily: 'Urbanist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
              >
                Start Exploring
              </button>
            </div>

            {/* Auto-redirect message */}
            <p
              className="text-body-sm text-charcoal/50 mt-4"
              style={{ fontFamily: 'Urbanist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
            >
              Redirecting to home in a few seconds...
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

