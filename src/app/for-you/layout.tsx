import { Metadata } from 'next';
import { PageMetadata } from '../lib/utils/seoMetadata';

export const metadata: Metadata = PageMetadata.forYou();

export default function ForYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

