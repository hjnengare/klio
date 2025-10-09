import { Star, MapPin } from "lucide-react";

interface ReviewerStatsProps {
  reviewCount: number;
  rating: number;
  location: string;
}

export default function ReviewerStats({
  reviewCount,
  rating,
  location,
}: ReviewerStatsProps) {
  return (
    <div className="text-[14px] text-charcoal/70 space-y-1">
      <div className="flex items-center gap-2">
        <Star
          size={14}
          className="text-coral"
          style={{ fill: "currentColor" }}
          aria-hidden="true"
        />
        <span className="font-sf font-600">{rating.toFixed(1)}</span>
        <span className="font-sf">• {reviewCount} reviews</span>
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
