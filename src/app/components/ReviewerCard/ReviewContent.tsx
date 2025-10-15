import Image from "next/image";
import { Heart } from "lucide-react";

interface ReviewContentProps {
  businessName: string;
  businessType: string;
  reviewText: string;
  date: string;
  likes: number;
  images?: string[];
}

export default function ReviewContent({
  businessName,
  businessType,
  reviewText,
  date,
  likes,
  images,
}: ReviewContentProps) {

  return (
    <div className="flex-1">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-sf font-700 text-charcoal">{businessName}</h4>
          <span className="text-xs text-charcoal/50 font-sf">{date}</span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-charcoal/60 font-sf">
            {businessType}
          </span>
        </div>
      </div>

      <p className="font-sf text-[14px] text-charcoal/80 leading-relaxed mb-3 line-clamp-3">
        {reviewText}
      </p>

      {images && images.length > 0 && (
        <div className="mb-3">
          <Image
            src={images[0]}
            alt="Review image"
            width={300}
            height={96}
            className="w-full h-24 object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>
      )}

      <div className="flex items-center gap-1 text-charcoal/60">
        <Heart
          size={14}
          className="text-charcoal/60"
          strokeWidth={2}
          aria-hidden="true"
        />
        <span className="text-xs font-sf">{likes}</span>
      </div>
    </div>
  );
}
