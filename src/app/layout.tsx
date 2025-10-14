import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { ToastProvider } from "./contexts/ToastContext";
import { SavedItemsProvider } from "./contexts/SavedItemsContext";
import PageTransitionProvider from "./components/Providers/PageTransitionProvider";
import WebVitals from "./components/Performance/WebVitals";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import BusinessNotifications from "./components/Notifications/BusinessNotifications";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://local-gems.vercel.app'),
  title: "KLIO - Discover trusted KLIO near you",
  description: "Find amazing local businesses, restaurants, and experiences in your area with personalized recommendations and trusted reviews.",
  keywords: "local business, restaurants, reviews, recommendations, KLIO",
  authors: [{ name: "KLIO" }],
  creator: "KLIO",
  openGraph: {
    title: "KLIO - Discover trusted local gems near you!",
    description: "Find amazing local businesses, restaurants, and experiences in your area with personalized recommendations and trusted reviews.",
    url: "/",
    siteName: "KLIO",
    images: [],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KLIO - Discover trusted KLIO near you",
    description: "Find amazing local businesses, restaurants, and experiences in your area with personalized recommendations and trusted reviews.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, viewport-fit=cover, user-scalable=no, shrink-to-fit=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="KLIO" />
        <meta name="theme-color" content="#749176" />
        <meta name="theme-color" content="#749176" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#749176" media="(prefers-color-scheme: dark)" />
        <meta name="msapplication-TileColor" content="#749176" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="apple-mobile-web-app-orientation" content="portrait" />

        {/* Enhanced mobile experience meta tags */}
        <meta name="mobile-web-app-title" content="KLIO" />
        <meta name="application-name" content="KLIO" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="full-screen" content="yes" />
        <meta name="browsermode" content="application" />
        <meta name="nightmode" content="enable/disable" />
        <meta name="layoutmode" content="fitscreen/standard" />

        {/* PWA Manifest - Icons defined in manifest.json when available */}

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="anonymous" />
        <link rel="canonical" href="/" />
        {/* Ionicons: Simple and reliable setup */}
        <Script
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
          type="module"
          strategy="afterInteractive"
        />
        <Script
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
          noModule
          strategy="afterInteractive"
        />
      </head>
      <body className={`${urbanist.className} no-layout-shift`}>
        <WebVitals />
        <ErrorBoundary>
          <ToastProvider>
            <AuthProvider>
              <OnboardingProvider>
                <SavedItemsProvider>
                  <PageTransitionProvider>
                    <BusinessNotifications />
                    {children}
                  </PageTransitionProvider>
                </SavedItemsProvider>
              </OnboardingProvider>
            </AuthProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
