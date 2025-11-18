import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - Your Reviews & Activity | sayso",
  description: "View your profile, review history, achievements, and saved businesses. Manage your account settings and preferences.",
  keywords: ["profile", "reviews", "account", "settings", "activity"],
  openGraph: {
    title: "Profile - Your Reviews & Activity | sayso",
    description: "View your profile, review history, achievements, and saved businesses. Manage your account settings and preferences.",
    url: "/profile",
    siteName: "sayso",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile - Your Reviews & Activity | sayso",
    description: "View your profile, review history, achievements, and saved businesses. Manage your account settings and preferences.",
  },
  alternates: {
    canonical: "/profile",
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

