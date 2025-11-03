export default function Loading() {
  return (
    <div className="min-h-dvh bg-off-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4">
          <div className="w-full h-full border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-base font-600 text-charcoal/80" style={{ fontFamily: '"Livvic", sans-serif', fontWeight: 600 }}>
          Loading...
        </h2>
      </div>
    </div>
  );
}
