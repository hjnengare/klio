/**
 * SEO Metadata Utility
 * Generates consistent SEO metadata for all pages
 */

import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sayso-nine.vercel.app';
const siteName = 'sayso';

export interface SEOOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
  nofollow?: boolean;
}

/**
 * Generate SEO metadata for a page
 */
export function generateSEOMetadata(options: SEOOptions = {}): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    noindex = false,
    nofollow = false,
  } = options;

  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Discover trusted local businesses near you`;
  const fullDescription = description || 'Find amazing local businesses, restaurants, and experiences in your area with personalized recommendations and trusted reviews.';
  const ogImage = image || `${baseUrl}/og-image.jpg`;
  const canonicalUrl = url ? `${baseUrl}${url}` : baseUrl;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: canonicalUrl,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || siteName,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
      creator: '@sayso',
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Predefined metadata for common pages
 */
export const PageMetadata = {
  home: (): Metadata => generateSEOMetadata({
    title: 'Home',
    description: 'Discover personalized local business recommendations tailored to your interests. Find the best restaurants, services, and experiences in your area.',
    keywords: ['home', 'discover', 'local businesses', 'recommendations', 'personalized'],
    url: '/home',
  }),

  explore: (): Metadata => generateSEOMetadata({
    title: 'Explore',
    description: 'Browse and discover amazing local businesses in your area. Filter by category, rating, distance, and more to find exactly what you\'re looking for.',
    keywords: ['explore', 'browse', 'local businesses', 'search', 'filter'],
    url: '/explore',
  }),

  forYou: (): Metadata => generateSEOMetadata({
    title: 'For You',
    description: 'Personalized business recommendations based on your interests and preferences. Discover businesses tailored just for you.',
    keywords: ['for you', 'personalized', 'recommendations', 'tailored', 'interests'],
    url: '/for-you',
  }),

  trending: (): Metadata => generateSEOMetadata({
    title: 'Trending',
    description: 'Discover the most popular and trending local businesses in your area. See what\'s hot right now.',
    keywords: ['trending', 'popular', 'hot', 'trending businesses', 'popular places'],
    url: '/trending',
  }),

  leaderboard: (): Metadata => generateSEOMetadata({
    title: 'Leaderboard',
    description: 'See the top reviewers and businesses in your community. Discover the most active contributors and highest-rated establishments.',
    keywords: ['leaderboard', 'top reviewers', 'top businesses', 'community', 'rankings'],
    url: '/leaderboard',
  }),

  eventsSpecials: (): Metadata => generateSEOMetadata({
    title: 'Events & Specials',
    description: 'Discover upcoming events, special offers, and promotions from local businesses. Never miss out on great deals and experiences.',
    keywords: ['events', 'specials', 'promotions', 'deals', 'offers', 'local events'],
    url: '/events-specials',
  }),

  dealBreakers: (): Metadata => generateSEOMetadata({
    title: 'Deal Breakers',
    description: 'Customize your preferences and set deal breakers to filter out businesses that don\'t meet your criteria.',
    keywords: ['deal breakers', 'preferences', 'filters', 'customize'],
    url: '/deal-breakers',
  }),

  profile: (): Metadata => generateSEOMetadata({
    title: 'Profile',
    description: 'View and manage your profile, reviews, and saved businesses.',
    keywords: ['profile', 'account', 'reviews', 'saved'],
    url: '/profile',
    noindex: true, // User profiles should not be indexed
  }),

  saved: (): Metadata => generateSEOMetadata({
    title: 'Saved',
    description: 'View your saved businesses and bookmarks.',
    keywords: ['saved', 'bookmarks', 'favorites'],
    url: '/saved',
    noindex: true, // User-specific pages should not be indexed
  }),

  login: (): Metadata => generateSEOMetadata({
    title: 'Login',
    description: 'Sign in to your sayso account to access personalized recommendations and manage your reviews.',
    keywords: ['login', 'sign in', 'account'],
    url: '/login',
    noindex: true,
  }),

  register: (): Metadata => generateSEOMetadata({
    title: 'Register',
    description: 'Create a new sayso account to start discovering and reviewing local businesses.',
    keywords: ['register', 'sign up', 'create account'],
    url: '/register',
    noindex: true,
  }),

  business: (businessName: string, description?: string, image?: string, slug?: string): Metadata => generateSEOMetadata({
    title: businessName,
    description: description || `Discover ${businessName} - read reviews, view photos, and get all the information you need.`,
    keywords: [businessName, 'business', 'reviews', 'local business'],
    image,
    url: slug ? `/business/${slug}` : undefined,
    type: 'article',
  }),

  event: (eventTitle: string, description?: string, image?: string, id?: string): Metadata => generateSEOMetadata({
    title: eventTitle,
    description: description || `Join us for ${eventTitle} - discover event details, location, and more.`,
    keywords: [eventTitle, 'event', 'local event', 'special'],
    image,
    url: id ? `/event/${id}` : undefined,
    type: 'article',
  }),

  reviewer: (reviewerName: string, id?: string): Metadata => generateSEOMetadata({
    title: `${reviewerName} - Reviewer Profile`,
    description: `View ${reviewerName}'s reviews and contributions to the sayso community.`,
    keywords: [reviewerName, 'reviewer', 'profile', 'reviews'],
    url: id ? `/reviewer/${id}` : undefined,
    type: 'profile',
    noindex: true, // Reviewer profiles may be indexed if public
  }),
};

