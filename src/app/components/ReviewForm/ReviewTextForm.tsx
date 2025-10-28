"use client";

interface ReviewTextFormProps {
  reviewTitle: string;
  reviewText: string;
  onTitleChange: (title: string) => void;
  onTextChange: (text: string) => void;
}

export default function ReviewTextForm({ 
  reviewTitle, 
  reviewText, 
  onTitleChange, 
  onTextChange 
}: ReviewTextFormProps) {
  return (
    <>
      {/* Review Title */}
      <div className="mb-4 md:mb-6 px-4">
        <h3 className="text-base md:text-lg font-600 text-charcoal mb-3 text-center md:text-left">
          Review Title (Optional)
        </h3>
        <input
          type="text"
          value={reviewTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Summarize your experience in a few words..."
          className="w-full bg-off-white backdrop-blur-sm border border-sage/20 rounded-6 px-4 md:px-6 py-3 md:py-4 text-body md:text-lg font-600 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all duration-300 input-mobile"
        />
      </div>

      {/* Review Text */}
      <div className="mb-6 md:mb-8 px-4">
        <h3 className="text-base md:text-xl font-600 text-charcoal mb-3 md:mb-4 text-center md:text-left">
          Tell us about your experience
        </h3>
        <textarea
          value={reviewText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Share your thoughts and help other locals..."
          rows={4}
          className="w-full bg-off-white backdrop-blur-sm border border-sage/20 rounded-6 px-4 md:px-6 py-3 md:py-4 text-body md:text-xl font-600 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all duration-300 resize-none flex-1 min-h-[120px] md:min-h-0 input-mobile"
        />
      </div>
    </>
  );
}
