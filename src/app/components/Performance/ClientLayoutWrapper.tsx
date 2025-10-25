"use client";

import dynamic from "next/dynamic";

// Client-side performance components
const ClientPerformanceWrapper = dynamic(() => import("./ClientPerformanceWrapper"), {
  ssr: false,
});

export default function ClientLayoutWrapper() {
  return <ClientPerformanceWrapper />;
}
