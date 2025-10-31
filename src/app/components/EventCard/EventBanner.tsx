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
    <div className="relative overflow-hidden rounded-t-[20px] flex-[2] md:flex-[3] z-10">
      <div className="relative w-full h-[400px] md:h-[300px]">
        {image ? (
          <Image
            src={image}
            alt={alt || title}
            fill
            sizes="(max-width: 768px) 540px, 320px"
            className="object-cover rounded-t-[20px]"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-sage/10 text-sage rounded-t-[20px]">
            <ImageIcon className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-sage/70" />
          </div>
        )}
      </div>

      {/* Badges */}
      <EventBadge startDate={startDate} endDate={endDate} />
      <RatingBadge rating={rating} />
    </div>
  );
}
