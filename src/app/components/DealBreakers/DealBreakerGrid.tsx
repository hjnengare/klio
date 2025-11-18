"use client";

import DealBreakerCard from "./DealBreakerCard";
import {
  ShieldCheck,
  Clock,
  Smile,
  BadgeDollarSign,
  CheckCircle,
} from "lucide-react";

interface DealBreaker {
  id: string;
  label: string;
  description: string;
  icon: string;
}

interface DealBreakerGridProps {
  dealbreakers: DealBreaker[];
  selectedDealbreakers: string[];
  onToggle: (id: string) => void;
}

const iconMap = {
  "shield-checkmark": ShieldCheck,
  "time": Clock,
  "happy": Smile,
  "cash-outline": BadgeDollarSign,
};

export default function DealBreakerGrid({ 
  dealbreakers, 
  selectedDealbreakers, 
  onToggle 
}: DealBreakerGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-6">
      {dealbreakers.map((dealbreaker, index) => {
        const isSelected = selectedDealbreakers.includes(dealbreaker.id);
        const IconComponent = iconMap[dealbreaker.icon as keyof typeof iconMap] || CheckCircle;

        return (
          <DealBreakerCard
            key={dealbreaker.id}
            dealbreaker={dealbreaker}
            isSelected={isSelected}
            onToggle={onToggle}
            index={index}
            IconComponent={IconComponent}
          />
        );
      })}
    </div>
  );
}
