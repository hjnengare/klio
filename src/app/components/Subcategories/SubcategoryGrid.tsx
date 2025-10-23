"use client";

import SubcategoryGroup from "./SubcategoryGroup";

interface SubcategoryItem {
  id: string;
  label: string;
  interest_id: string;
}

interface GroupedSubcategories {
  [interestId: string]: {
    title: string;
    items: SubcategoryItem[];
  };
}

interface SubcategoryGridProps {
  groupedSubcategories: GroupedSubcategories;
  selectedSubcategories: Array<{ id: string; interest_id: string }>;
  onToggle: (id: string, interestId: string) => void;
  subcategories: SubcategoryItem[];
  loading: boolean;
}

export default function SubcategoryGrid({ 
  groupedSubcategories, 
  selectedSubcategories, 
  onToggle, 
  subcategories, 
  loading 
}: SubcategoryGridProps) {
  const sf = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedSubcategories).map(([interestId, group], groupIndex) => (
        <SubcategoryGroup
          key={interestId}
          interestId={interestId}
          title={group.title}
          items={group.items}
          selectedSubcategories={selectedSubcategories}
          onToggle={onToggle}
          groupIndex={groupIndex}
        />
      ))}

      {subcategories.length === 0 && !loading && (
        <div className="text-center text-charcoal/60 py-8" style={sf}>
          <p>No subcategories found for your selected interests.</p>
        </div>
      )}
    </div>
  );
}
