import Image from "next/image";
import { ImageIcon } from "lucide-react";
import EventIcon from "./EventIcon";
import EventBadge from "./EventBadge";
import RatingBadge from "./RatingBadge";

interface EventBannerProps {
  image?: string;
  alt?: string;
  icon?: string;
  title: string;
  rating: number;
  startDate: string;
  endDate?: string;
}

export default function EventBanner({ 
  image, 
  alt, 
  icon, 
  title, 
  rating, 
  startDate, 
  endDate 
}: EventBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-t-2xl h-[180px]">
      {/* Image or Icon placeholder */}
      {image ? (
        <Image
          src={image}
          alt={alt || title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-sage/10 text-sage">
          <ImageIcon className="w-12 h-12 text-sage/70" />
        </div>
      )}

      <EventBadge startDate={startDate} endDate={endDate} />
      <RatingBadge rating={rating} />
    </div>
  );
}