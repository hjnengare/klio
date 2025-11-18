import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Highlights - Top Reviewers & Businesses | sayso",
  description: "See the top contributors and featured businesses in your community. Discover the most active reviewers and highest-rated local businesses this month.",
  keywords: ["leaderboard", "top reviewers", "community", "featured businesses", "top contributors"],
  openGraph: {
    title: "Community Highlights - Top Reviewers & Businesses | sayso",
    description: "See the top contributors and featured businesses in your community. Discover the most active reviewers and highest-rated local businesses this month.",
    url: "/leaderboard",
    siteName: "sayso",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Highlights - Top Reviewers & Businesses | sayso",
    description: "See the top contributors and featured businesses in your community. Discover the most active reviewers and highest-rated local businesses this month.",
  },
  alternates: {
    canonical: "/leaderboard",
  },
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

