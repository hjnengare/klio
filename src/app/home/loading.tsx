export default function Loading() {
  return (
    <div className="min-h-dvh bg-off-white">
      {/* Header Skeleton */}
      <div className="h-16 bg-off-white/90 backdrop-blur-xl border-b border-sage/10 animate-pulse" />

      {/* Hero Skeleton */}
      <div className="h-64 bg-sage/5 animate-pulse" />

      {/* Content Skeleton */}
      <div className="container mx-auto max-w-[1300px] px-4 py-8 space-y-8">
        {/* Business Row Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-sage/10 rounded animate-pulse" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-64 h-80 bg-sage/10 rounded-2xl animate-pulse flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
