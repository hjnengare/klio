import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Discover Local Businesses | sayso",
  description: "Discover amazing local businesses, restaurants, and experiences in your area. Get personalized recommendations, read authentic reviews, and explore trending places near you.",
  keywords: ["local business", "restaurants", "reviews", "recommendations", "trending", "for you"],
  openGraph: {
    title: "Home - Discover Local Businesses | sayso",
    description: "Discover amazing local businesses, restaurants, and experiences in your area. Get personalized recommendations, read authentic reviews, and explore trending places near you.",
    url: "/home",
    siteName: "sayso",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home - Discover Local Businesses | sayso",
    description: "Discover amazing local businesses, restaurants, and experiences in your area. Get personalized recommendations, read authentic reviews, and explore trending places near you.",
  },
  alternates: {
    canonical: "/home",
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

