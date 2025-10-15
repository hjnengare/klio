import { MapPin } from "lucide-react";

interface ReviewerStatsProps {
  reviewCount: number;
  location: string;
}

export default function ReviewerStats({
  reviewCount,
  location,
}: ReviewerStatsProps) {
  return (
    <div className="text-[14px] text-charcoal/70 space-y-1">
      <div className="flex items-center gap-2">
        <span className="font-sf">{reviewCount} reviews</span>
      </div>

      <div className="flex items-center gap-1.5">
        <MapPin
          size={14}
          className="text-sage"
          strokeWidth={2.5}
          aria-hidden="true"
        />
        <span className="font-sf">{location}</span>
      </div>
    </div>
  );
}
