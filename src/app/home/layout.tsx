import { Metadata } from 'next';
import { PageMetadata } from '../lib/utils/seoMetadata';

export const metadata: Metadata = PageMetadata.home();

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
