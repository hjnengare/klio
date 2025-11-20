import { Metadata } from 'next';
import { PageMetadata } from '../lib/utils/seoMetadata';

export const metadata: Metadata = PageMetadata.eventsSpecials();

export default function EventsSpecialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

