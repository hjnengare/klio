"use client";

interface ErrorMessageProps {
  error: string;
  isOffline: boolean;
}

export default function ErrorMessage({ error, isOffline }: ErrorMessageProps) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="font-sf text-[14px] font-600 text-red-600">{error}</p>
      </div>
    );
  }

  if (isOffline) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
        <p className="font-sf text-[14px] font-600 text-orange-600">You&apos;re offline. We&apos;ll try again when you&apos;re back online.</p>
      </div>
    );
  }

  return null;
}
