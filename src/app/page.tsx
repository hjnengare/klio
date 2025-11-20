import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { PageMetadata } from './lib/utils/seoMetadata';

// Set canonical to /home to prevent duplicate content
export const metadata: Metadata = {
  ...PageMetadata.home(),
  alternates: {
    canonical: '/home', // Point canonical to /home since this redirects there
  },
  robots: {
    index: false, // Don't index the redirect page
    follow: true,
  },
};

/**
 * Root page - redirects to /home
 * Using server-side redirect to prevent duplicate content issues
 */
export default function RootPage() {
  redirect('/home');
}
