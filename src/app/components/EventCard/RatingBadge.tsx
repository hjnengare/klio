interface RatingBadgeProps {
  rating: number;
}

export default function RatingBadge({ rating }: RatingBadgeProps) {
  return (
    <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded-full bg-gradient-to-br from-off-white via-off-white to-off-white/90 backdrop-blur-xl px-3 py-1.5 text-charcoal shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-white/60 ring-1 ring-white/30">
      <svg className="w-4 h-4 text-navbar-bg" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span className="font-urbanist text-sm font-600">{rating.toFixed(1)}</span>
    </span>
  );
}
