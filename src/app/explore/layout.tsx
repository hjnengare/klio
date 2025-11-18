import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Businesses - Find Local Gems | sayso",
  description: "Browse and discover local businesses in your area. Filter by category, rating, and distance. Find the perfect restaurant, service, or experience near you.",
  keywords: ["explore", "local business", "search", "filter", "restaurants", "services", "near me"],
  openGraph: {
    title: "Explore Businesses - Find Local Gems | sayso",
    description: "Browse and discover local businesses in your area. Filter by category, rating, and distance. Find the perfect restaurant, service, or experience near you.",
    url: "/explore",
    siteName: "sayso",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Businesses - Find Local Gems | sayso",
    description: "Browse and discover local businesses in your area. Filter by category, rating, and distance. Find the perfect restaurant, service, or experience near you.",
  },
  alternates: {
    canonical: "/explore",
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

