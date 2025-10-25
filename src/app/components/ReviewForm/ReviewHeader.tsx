"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const frostyHeader = `
  fixed top-0 left-0 right-0 z-50
  backdrop-blur-xl bg-navbar-bg
  shadow-lg shadow-sage/5 border-b border-white/5
`.replace(/\s+/g, " ");

export default function ReviewHeader() {
  return (
    <header className={frostyHeader + "px-4 py-4 shadow-md fixed top-0 left-0 right-0 z-50"}>
      <div className="flex items-center max-w-7xl mx-auto">
        <Link href="/home" className="group flex items-center">
          <div className="w-10 h-10 md:w-12 md:h-12 z-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/10 hover:border-white/30 mr-3 md:mr-4">
            <ArrowLeft className="text-white group-hover:text-white/90 transition-colors duration-300" size={22} />
          </div>
          <h1 className="font-urbanist text-sm font-700 text-white z-10 transition-all duration-300">
            Write a Review
          </h1>
        </Link>
      </div>
    </header>
  );
}
