import { Metadata } from 'next';
import { PageMetadata } from '../lib/utils/seoMetadata';

export const metadata: Metadata = PageMetadata.login();

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

