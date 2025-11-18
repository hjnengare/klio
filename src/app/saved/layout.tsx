import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Businesses - Your Favorites | sayso",
  description: "View and manage your saved businesses. Quick access to your favorite local gems and places you want to visit.",
  keywords: ["saved", "favorites", "bookmarks", "saved businesses"],
  openGraph: {
    title: "Saved Businesses - Your Favorites | sayso",
    description: "View and manage your saved businesses. Quick access to your favorite local gems and places you want to visit.",
    url: "/saved",
    siteName: "sayso",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saved Businesses - Your Favorites | sayso",
    description: "View and manage your saved businesses. Quick access to your favorite local gems and places you want to visit.",
  },
  alternates: {
    canonical: "/saved",
  },
};

export default function SavedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

