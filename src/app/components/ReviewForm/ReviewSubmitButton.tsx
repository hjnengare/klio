"use client";

import { ArrowRight } from "react-feather";

interface ReviewSubmitButtonProps {
  isFormValid: boolean;
  onSubmit: () => void;
}

export default function ReviewSubmitButton({ isFormValid, onSubmit }: ReviewSubmitButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isFormValid) {
      e.preventDefault();
      return;
    }
    onSubmit();
  };

  return (
    <div className="px-4">
      <button
        type="button"
        onClick={handleClick}
        className={`w-full py-3 px-5 rounded-full text-sm font-600 transition-all duration-300 relative overflow-hidden btn-target btn-press ${isFormValid
            ? "bg-navbar-bg hover:bg-navbar-bg/90 text-white focus:outline-none focus:ring-2 focus:ring-navbar-bg/50 focus:ring-offset-2 group hover:shadow-lg cursor-pointer"
            : "bg-charcoal/20 text-charcoal/40 cursor-not-allowed"
          }`}
        disabled={!isFormValid}
      >
        <span className="relative z-10 flex items-center justify-center space-x-2">
          <span>Submit Review</span>
          {isFormValid && <ArrowRight size={16} />}
        </span>
      </button>
    </div>
  );
}
