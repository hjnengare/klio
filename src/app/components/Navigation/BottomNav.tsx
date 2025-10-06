"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import useMobileBottomNav from "../../hooks/useMobileBottomNav";

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  {
    name: "Home",
    href: "/home",
    icon: "home"
  },
  {
    name: "Leaderboard",
    href: "/leaderboard",
    icon: "trophy"
  }
];

export default function BottomNav() {
  const pathname = usePathname();

  // Only show bottom nav on home page and leaderboard
  const allowedPages = ['/home', '/leaderboard'];

  const { isVisible, shouldShowNav } = useMobileBottomNav({
    allowedPages,
    pathname,
    scrollThreshold: 50,
    throttleMs: 16
  });

  // Don't render nav at all if not on allowed pages
  if (!shouldShowNav) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{
        y: isVisible ? 0 : 100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-off-white/95 backdrop-blur-xl border-t border-sage/10 md:hidden"
    >
      <div className="flex items-center justify-around py-1 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              className="relative flex flex-col items-center space-y-0.5 py-1 px-3 rounded-xl transition-all duration-300 group"
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavActive"
                  className="absolute inset-0 bg-sage/10 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Icon container */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
                  isActive
                    ? "!bg-sage !text-white shadow-lg"
                    : "text-charcoal/60 group-hover:text-sage group-hover:bg-sage/10"
                }`}
              >
                <ion-icon
                  name={isActive ? item.icon : `${item.icon}-outline`}
                  class="text-base"
                  style={isActive ? { color: 'white' } : undefined}
                />
              </motion.div>

              {/* Label */}
              <span
                className={`relative z-10 font-urbanist text-xs font-600 transition-all duration-300 ${
                  isActive
                    ? "!text-sage"
                    : "text-charcoal/60 group-hover:text-sage"
                }`}
              >
                {item.name}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 w-1 h-1 bg-sage rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* iPhone-style home indicator */}
      <div className="flex justify-center pb-1">
        <div className="w-32 h-0.5 bg-charcoal/20 rounded-full" />
      </div>
    </motion.nav>
  );
}