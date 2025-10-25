export default function Loading() {
  return (
    <div className="min-h-dvh bg-off-white">
      {/* Header Skeleton */}
      <div className="h-16 bg-off-white/90 backdrop-blur-xl border-b border-sage/10 animate-pulse" />

      {/* Content */}
      <div className="container mx-auto max-w-[1300px] px-4 py-8">
        <div className="h-8 w-48 bg-sage/10 rounded mb-6 animate-pulse" />

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-80 bg-sage/10 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
