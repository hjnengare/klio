import { Star } from "lucide-react";

export default function Stars({ value = 5 }: { value?: number }) {
  const full = Math.max(0, Math.min(5, Math.floor(value)));

  return (
    <div className="flex items-center gap-[2px] text-[15px] text-amber-500" aria-label={`Rating: ${full} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const active = i < full;
        return (
          <Star
            key={i}
            className={active ? "text-amber-500" : "text-gray-300"}
            // lucide is outline-first; fill to simulate a solid star
            style={{ width: 15, height: 15, fill: active ? "currentColor" : "none" }}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
