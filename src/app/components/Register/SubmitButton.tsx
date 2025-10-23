"use client";

import { motion } from "framer-motion";
import PremiumHover from "../Animations/PremiumHover";

interface SubmitButtonProps {
  disabled: boolean;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SubmitButton({ disabled, isSubmitting, onSubmit }: SubmitButtonProps) {
  return (
    <div className="pt-4 flex justify-center">
      <div className="w-full">
        <PremiumHover scale={1.02} shadowIntensity="strong">
          <motion.button
            type="submit"
            disabled={disabled}
            onClick={onSubmit}
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
            className={`group block w-full text-base font-semibold py-3 px-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 relative overflow-hidden text-center min-h-[48px] whitespace-nowrap ${
              disabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                : 'btn-premium text-white focus:ring-sage/30'
            }`}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            transition={{ duration: 0.1 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              {isSubmitting ? "Creating account..." : "Create account"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-coral to-coral/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </PremiumHover>
      </div>
    </div>
  );
}
