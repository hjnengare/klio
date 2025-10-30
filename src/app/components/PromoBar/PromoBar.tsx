"use client";

import Link from "next/link";

export default function PromoBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-navbar-bg text-white">
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="h-10 sm:h-11 flex items-center justify-center text-center">
          <p className="text-xs sm:text-sm font-medium">
            Grow with KLIO — register your business to reach nearby customers, collect reviews, and increase
            visibility across the community. <Link href="/claim-business" className="underline underline-offset-2 hover:text-sage transition-colors font-semibold">Claim your listing</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}


