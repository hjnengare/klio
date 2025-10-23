"use client";

import { motion } from "framer-motion";
import { colors } from '@/app/design-system/tokens';

interface SaysoLogoProps {
  size?: "small" | "medium" | "large" | "xl";
  className?: string;
  animated?: boolean;
  variant?: "default" | "gradient" | "outline";
}

export default function SaysoLogo({
  size = "medium",
  className = "",
  animated = true,
  variant = "default"
}: SaysoLogoProps) {

  // Size mappings
  const sizeClasses = {
    small: "text-xl sm:text-2xl",
    medium: "text-2xl sm:text-3xl md:text-4xl",
    large: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
    xl: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
  };

  // Color mappings for each letter using design system tokens
  const letterColors = {
    S: colors.primary.sage[500],     // Sage
    A: colors.primary.coral[500],   // Coral
    Y: colors.neutral['off-white'][100], // Off-white
    S2: colors.neutral.charcoal[500],  // Charcoal
    O: colors.primary.sage[500]     // Sage
  };

  // Variant styles
  const getLetterStyle = (letter: keyof typeof letterColors) => {
    const baseColor = letterColors[letter];

    switch (variant) {
      case "gradient":
        return {
          color: "transparent",
          backgroundImage: `linear-gradient(135deg, ${baseColor}, ${baseColor}dd)`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text"
        };
      case "outline":
        return {
          color: "transparent",
          WebkitTextStroke: `2px ${baseColor}`,
          textShadow: `0 0 8px ${baseColor}20`
        };
      default:
        return {
          color: baseColor,
          textShadow: letter === "Y" ? "0 1px 2px rgba(0,0,0,0.1)" : "none" // Add shadow for off-white letter
        };
    }
  };

  const logoContent = (
    <span className={`font-sf font-700 tracking-tight ${sizeClasses[size]} ${className}`}>
      <span style={getLetterStyle("S")}>s</span>
      <span style={getLetterStyle("A")}>a</span>
      <span style={getLetterStyle("Y")}>y</span>
      <span style={getLetterStyle("S2")}>s</span>
      <span style={getLetterStyle("O")}>o</span>
    </span>
  );

  if (!animated) {
    return logoContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }}
      className="inline-block"
    >
      <span className={`font-sf font-700 tracking-tight ${sizeClasses[size]} ${className}`}>
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, type: "spring", bounce: 0.3 }}
          style={getLetterStyle("S")}
          className="inline-block"
        >
          s
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, type: "spring", bounce: 0.3 }}
          style={getLetterStyle("A")}
          className="inline-block"
        >
          a
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, type: "spring", bounce: 0.3 }}
          style={getLetterStyle("Y")}
          className="inline-block"
        >
          y
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4, type: "spring", bounce: 0.3 }}
          style={getLetterStyle("S2")}
          className="inline-block"
        >
          s
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, type: "spring", bounce: 0.3 }}
          style={getLetterStyle("O")}
          className="inline-block"
        >
          o
        </motion.span>
      </span>
    </motion.div>
  );
}
