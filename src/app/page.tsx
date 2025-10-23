"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Direct redirect to home for UI/UX design (no auth required)
    router.push("/home");
  }, [router]);

  return (
    <div className="min-h-dvh  bg-off-white   flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4">
          <div className="w-full h-full border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="font-sf text-4 font-700 text-charcoal mb-2">
          sayso
        </h1>
        <p className="font-sf text-6 font-400 text-charcoal/70">
          Getting ready...
        </p>
      </div>
    </div>
  );
}