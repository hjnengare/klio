"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Calendar } from "react-feather";
import { EVENTS_AND_SPECIALS, Event } from "../../data/eventsData";
import { useToast } from "../../contexts/ToastContext";
import dynamic from "next/dynamic";
import { PageLoader } from "../../components/Loader";
import {
  EventDetailHeader,
  EventHeroImage,
  EventInfo,
  EventDetailsCard,
  EventDescription,
  EventActionCard,
  EventContactInfo,
} from "../../components/EventDetail";

const Footer = dynamic(() => import("../../components/Footer/Footer"), {
  loading: () => null,
  ssr: false,
});

interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { showToast } = useToast();

  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);

  useEffect(() => {
    // Find the event by ID
    const foundEvent = EVENTS_AND_SPECIALS.find(e => e.id === resolvedParams.id);
    if (foundEvent) {
      setEvent(foundEvent);
    }
    setLoading(false);
  }, [resolvedParams.id]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showToast(
      isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      "success"
    );
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    showToast(
      isLiked ? "Removed from favorites" : "Added to favorites",
      "success"
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard", "success");
    }
  };

  if (loading) {
    return <PageLoader size="xl" color="sage" />;
  }

  if (!event) {
    return (
      <div className="min-h-dvh bg-off-white flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Calendar className="w-7 h-7 text-charcoal" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal mb-4 font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Event Not Found</h1>
          <Link href="/events-specials" className="px-6 py-2.5 bg-charcoal text-white rounded-full text-sm font-600 hover:bg-charcoal/90 transition-all duration-300 hover:shadow-lg inline-block font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
            Back to Events & Specials
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-off-white">
      {/* Header */}
      <EventDetailHeader
        isBookmarked={isBookmarked}
        onBookmark={handleBookmark}
        onShare={handleShare}
      />

      <div className="bg-gradient-to-b from-off-white/0 via-off-white/50 to-off-white">
        <div className="py-1 pt-20">

        {/* Main Content Section */}
        <section
          className="relative font-sf-pro pt-4 sm:pt-6"
        >
          <div className="container mx-auto max-w-[1300px] px-3 sm:px-4 md:px-6 relative z-10">
            <div className="pt-2 pb-12 sm:pb-16 md:pb-20">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
                  <EventHeroImage event={event} isLiked={isLiked} onLike={handleLike} />
                  <EventInfo event={event} />
                  <EventDetailsCard event={event} />
                  <EventDescription event={event} />
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-4 sm:space-y-6">
                  <EventActionCard />
                  <EventContactInfo event={event} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
        </div>
      </div>
    </div>
  );
}
