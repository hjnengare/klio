export default function LoginLoading() {
  return (
    <div className="min-h-dvh bg-off-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-sage/30 border-t-sage rounded-full animate-spin" />
        <p className="font-sf text-sm text-charcoal/70">Loading...</p>
      </div>
    </div>
  );
}

