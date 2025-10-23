"use client";

interface TagSelectorProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
}

export default function TagSelector({ selectedTags, onTagToggle, availableTags }: TagSelectorProps) {
  return (
    <div className="mb-6 md:mb-8 px-4">
      <h3 className="text-base md:text-xl font-600 text-charcoal mb-3 md:mb-4 text-center md:text-left">
        Choose up to 4 quick tags
      </h3>
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`
              px-4 md:px-6 py-3 md:py-4 rounded-full border-2 transition-all duration-300 text-sm font-600 btn-target
              ${selectedTags.includes(tag)
                ? "bg-sage border-sage text-white shadow-lg"
                : "bg-off-white backdrop-blur-sm border-sage/20 text-charcoal hover:border-sage hover:bg-sage/10"
              }
              focus:outline-none focus:ring-2 focus:ring-sage/50 focus:ring-offset-2
            `}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
