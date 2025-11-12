import { Star } from "react-feather";

export default function Stars({ value = 5, color = "amber-500" }: { value?: number; color?: string }) {
  const full = value !== undefined ? Math.max(0, Math.min(5, Math.floor(value))) : 0;
  const isCoral = color === "coral" || color === "coral/90";

  return (
    <div className="flex items-center gap-[2px] text-[15px] group-hover/rating:scale-110 transition-transform duration-200" aria-label={`Rating: ${value !== undefined ? value.toFixed(1) : 'No rating'} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const active = i < full;
        return (
          <Star
            key={i}
            className={`transition-all duration-200 ${
              active
                ? isCoral
                  ? 'text-coral fill-coral/90 group-hover/rating:text-coral group-hover/rating:fill-coral stroke-coral'
                  : 'text-coral fill-amber-400 group-hover/rating:text-coral group-hover/rating:fill-amber-500 stroke-coral'
                : 'text-coral group-hover/rating:text-coral stroke-coral'
            }`}
            style={{ width: 15, height: 15 }}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
