interface EventBadgeProps {
  startDate: string;
  endDate?: string;
}

export default function EventBadge({ startDate, endDate }: EventBadgeProps) {
  return (
    <div className="absolute left-2 top-2 z-20">
      <span className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-off-white via-off-white to-off-white/90 backdrop-blur-xl px-2.5 py-1 text-charcoal shadow-[0_4px_20px_rgba(0,0,0,0.15)] ring-1 ring-white/30 border border-white/60">
        <div className="w-2 h-2 bg-coral rounded-full"></div>
        <span className="text-xs font-600" style={{ fontFamily: 'Urbanist', -apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontWeight: 600 }}>
          {endDate ? `${startDate} - ${endDate}` : startDate}
        </span>
      </span>
    </div>
  );
}
