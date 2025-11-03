"use client";

import { CheckCircle } from "lucide-react";

interface SubcategoryPillProps {
  subcategory: {
    id: string;
    label: string;
    interest_id: string;
  };
  isSelected: boolean;
  onToggle: (id: string, interestId: string) => void;
}

export default function SubcategoryPill({ subcategory, isSelected, onToggle }: SubcategoryPillProps) {
  const livvic = {
    fontFamily: '"Livvic", sans-serif',
    fontWeight: 600,
  };

  return (
    <button
      onClick={() => onToggle(subcategory.id, subcategory.interest_id)}
      className={`
        relative flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2
        ${isSelected
          ? 'border-coral bg-coral text-white shadow-sm scale-105'
          : 'border-sage/30 bg-sage/5 text-sage hover:bg-sage/10 hover:border-sage/40 hover:scale-105'
        }
      `}
      style={livvic}
    >
      <span>{subcategory.label}</span>
      {isSelected && (
        <CheckCircle className="h-4 w-4" />
      )}
    </button>
  );
}
