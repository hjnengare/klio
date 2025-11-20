import { Metadata } from 'next';
import { PageMetadata } from '../lib/utils/seoMetadata';

export const metadata: Metadata = PageMetadata.trending();

export default function TrendingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

