"use client";

import { ArrowRight } from "lucide-react";

interface ReviewSubmitButtonProps {
  isFormValid: boolean;
  onSubmit: () => void;
}

export default function ReviewSubmitButton({ isFormValid, onSubmit }: ReviewSubmitButtonProps) {
  return (
    <div className="px-4">
      <button
        onClick={onSubmit}
        className={`w-full py-4 px-6 rounded-lg text-base md:text-lg font-600 transition-all duration-300 relative overflow-hidden btn-target btn-press ${isFormValid
            ? "bg-gradient-to-r from-sage to-sage/90 text-white focus:outline-none focus:ring-2 focus:ring-sage/50 focus:ring-offset-2 group hover:shadow-1"
            : "bg-charcoal/20 text-charcoal/40 cursor-not-allowed"
          }`}
        disabled={!isFormValid}
      >
        <span className="relative z-10 flex items-center justify-center space-x-2">
          <span>Submit Review</span>
          {isFormValid && <ArrowRight size={18} />}
        </span>
      </button>
    </div>
  );
}
