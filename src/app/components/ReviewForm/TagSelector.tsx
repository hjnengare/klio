"use client";

interface TagSelectorProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
}

export default function TagSelector({ selectedTags, onTagToggle, availableTags }: TagSelectorProps) {
  return (
    <div className="mb-3 px-4">
      <h3 className="text-sm font-bold text-charcoal mb-3 text-center md:text-left">
        Choose up to 4 quick tags
      </h3>
      <div className="flex flex-wrap justify-center gap-2.5">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`
              px-5 py-3 rounded-full border-2 transition-all duration-300 text-sm font-400 btn-target
              ${selectedTags.includes(tag)
                ? "bg-navbar-bg border-navbar-bg text-white shadow-lg"
                : "bg-off-white backdrop-blur-sm border-navbar-bg/20 text-charcoal hover:border-navbar-bg hover:bg-navbar-bg/10"
              }
              focus:outline-none focus:ring-2 focus:ring-navbar-bg/50 focus:ring-offset-2
            `}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
