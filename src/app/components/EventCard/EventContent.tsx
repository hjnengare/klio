import Link from "next/link";
import { MapPin } from "lucide-react";

interface EventContentProps {
  title: string;
  location: string;
  description?: string;
  href?: string;
}

export default function EventContent({ title, location, description, href }: EventContentProps) {
  return (
    <div className="p-4 relative flex-1 flex flex-col justify-between">
      {/* Top content */}
      <div className="space-y-2">
        {/* Event title */}
        <h3 className="font-urbanist text-base font-600 text-charcoal transition-colors duration-200 md:group-hover:text-sage line-clamp-2">
          <Link href={href || "#"} className="md:hover:underline decoration-2 underline-offset-2">
            {title}
          </Link>
        </h3>

        {/* Location */}
        <p className="font-urbanist text-sm font-600 text-charcoal/70 transition-colors duration-200 md:group-hover:text-charcoal/80 line-clamp-1 flex items-center">
          <MapPin className="w-4 h-4 text-sage mr-1.5 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </p>
      </div>

      {/* Description - bottom aligned */}
      {description && (
        <p className="font-urbanist text-sm font-400 text-charcoal/60 line-clamp-3 mt-3">
          {description}
        </p>
      )}
    </div>
  );
}