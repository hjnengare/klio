export default function Loading() {
  return (
    <div className="min-h-dvh bg-off-white">
      {/* Header Skeleton */}
      <div className="h-16 bg-off-white/90 backdrop-blur-xl border-b border-sage/10 animate-pulse" />

      {/* Profile Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Profile Header Skeleton */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-sage/10 animate-pulse">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-sage/10" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-32 bg-sage/10 rounded" />
              <div className="h-4 w-48 bg-sage/10 rounded" />
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-sage/10 animate-pulse">
              <div className="h-8 w-12 bg-sage/10 rounded mb-2" />
              <div className="h-4 w-20 bg-sage/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
