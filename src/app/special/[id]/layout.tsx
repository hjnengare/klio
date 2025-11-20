import { Metadata } from 'next';
import { EVENTS_AND_SPECIALS } from '../../data/eventsData';
import { generateSEOMetadata } from '../../lib/utils/seoMetadata';

interface SpecialLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

/**
 * Generate dynamic metadata for special pages
 */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  const special = EVENTS_AND_SPECIALS.find(e => e.id === id);

  if (!special) {
    return generateSEOMetadata({
      title: 'Special',
      description: 'View special offer details and information.',
      url: `/special/${id}`,
    });
  }

  return generateSEOMetadata({
    title: special.title,
    description: special.description || `Discover ${special.title} - special offer details and information.`,
    keywords: [special.title, 'special', 'offer', 'promotion'],
    image: special.image,
    url: `/special/${id}`,
    type: 'article',
  });
}

export default async function SpecialLayout({
  children,
}: SpecialLayoutProps) {
  return <>{children}</>;
}

