import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Specials - Local Happenings & Offers | sayso",
  description: "Discover upcoming events, special offers, and seasonal happenings at local businesses. Find exclusive deals and limited-time promotions near you.",
  keywords: ["events", "specials", "offers", "promotions", "local events", "deals"],
  openGraph: {
    title: "Events & Specials - Local Happenings & Offers | sayso",
    description: "Discover upcoming events, special offers, and seasonal happenings at local businesses. Find exclusive deals and limited-time promotions near you.",
    url: "/events-specials",
    siteName: "sayso",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Events & Specials - Local Happenings & Offers | sayso",
    description: "Discover upcoming events, special offers, and seasonal happenings at local businesses. Find exclusive deals and limited-time promotions near you.",
  },
  alternates: {
    canonical: "/events-specials",
  },
};

export default function EventsSpecialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

