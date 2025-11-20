import { Metadata } from 'next';
import { EVENTS_AND_SPECIALS } from '../../data/eventsData';
import { generateSEOMetadata } from '../../lib/utils/seoMetadata';

interface EventLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

/**
 * Generate dynamic metadata for event pages
 */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  const event = EVENTS_AND_SPECIALS.find(e => e.id === id);

  if (!event) {
    return generateSEOMetadata({
      title: 'Event',
      description: 'View event details and information.',
      url: `/event/${id}`,
    });
  }

  return generateSEOMetadata({
    title: event.title,
    description: event.description || `Join us for ${event.title} - discover event details, location, and more.`,
    keywords: [event.title, 'event', 'local event', 'special'],
    image: event.image,
    url: `/event/${id}`,
    type: 'article',
  });
}

export default async function EventLayout({
  children,
}: EventLayoutProps) {
  return <>{children}</>;
}

