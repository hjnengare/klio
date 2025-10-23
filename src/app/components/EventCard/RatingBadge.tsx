interface RatingBadgeProps {
  rating: number;
}

export default function RatingBadge({ rating }: RatingBadgeProps) {
  return (
    <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded-full bg-off-white/50 backdrop-blur-sm px-3 py-1.5 text-charcoal shadow-lg">
      <svg className="w-4 h-4 text-navbar-bg" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span className="font-sf text-sm font-600">{rating.toFixed(1)}</span>
    </span>
  );
}