"use client";

import Link from "next/link";
import { ArrowLeft } from "react-feather";

interface AuthHeaderProps {
  backLink: string;
  title: string;
  subtitle: string;
}

export function AuthHeader({ backLink, title, subtitle }: AuthHeaderProps) {
  const sf = {
    fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
  };

  return (
    <>
      {/* Back button with entrance animation */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 animate-slide-in-left animate-delay-200">
        <Link href={backLink} className="text-charcoal hover:text-charcoal/80 transition-colors duration-300 p-2 hover:bg-off-white/50 rounded-lg block backdrop-blur-sm">
          <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
        </Link>
      </div>

      {/* Header with premium styling and animations */}
      <div className="text-center mb-4">
        <div className="inline-block relative mb-4 animate-fade-in-up animate-delay-400">
          <h2 className="text-xl sm:text-lg md:text-lg lg:text-4xl font-bold text-charcoal mb-2 text-center leading-snug px-2 tracking-tight" style={sf}>
            {title}
          </h2>
        </div>
        <p className="text-sm md:text-base font-normal text-charcoal/70 mb-4 leading-relaxed px-2 max-w-lg mx-auto animate-fade-in-up animate-delay-700" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>
          {subtitle}
        </p>
      </div>
    </>
  );
}
