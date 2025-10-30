import { Star } from "lucide-react";

interface RatingBadgeProps {
  rating: number;
}

export default function RatingBadge({ rating }: RatingBadgeProps) {
  return (
    <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded-xl bg-gradient-to-br from-off-white via-off-white to-off-white/90 backdrop-blur-xl px-3 py-1.5 text-charcoal border border-white/60 ring-1 ring-white/30">
      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
      <span className="text-sm font-semibold">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}
