import type { Metadata } from "next";
import { Urbanist, Italianno } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { ToastProvider } from "./contexts/ToastContext";
import { SavedItemsProvider } from "./contexts/SavedItemsContext";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

// Lazy load non-critical components for faster initial load
const PageTransitionProvider = dynamic(() => import("./components/Providers/PageTransitionProvider"), {
  ssr: true,
});
const WebVitals = dynamic(() => import("./components/Performance/WebVitals"));
const BusinessNotifications = dynamic(() => import("./components/Notifications/BusinessNotifications"));
const ClientLayoutWrapper = dynamic(() => import("./components/Performance/ClientLayoutWrapper"));

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

const italianno = Italianno({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  fallback: ["cursive"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://local-gems.vercel.app'),
  title: "sayso - Discover trusted sayso near you",
  description: "Find amazing local businesses, restaurants, and experiences in your area with personalized recommendations and trusted reviews.",
  keywords: "local business, restaurants, reviews, recommendations, sayso",
  authors: [{ name: "sayso" }],
  creator: "sayso",
  openGraph: {
    title: "sayso - Discover trusted local gems near you!",
    description: "Find amazing local businesses, restaurants, and experiences in your area with personalized recommendations and trusted reviews.",
    url: "/",
    siteName: "sayso",
    images: [],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "sayso - Discover trusted sayso near you",
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
        <meta name="apple-mobile-web-app-title" content="sayso" />
        <meta name="theme-color" content="#9DAB9B" />
        <meta name="theme-color" content="#9DAB9B" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#9DAB9B" media="(prefers-color-scheme: dark)" />
        <meta name="msapplication-TileColor" content="#9DAB9B" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="apple-mobile-web-app-orientation" content="portrait" />

        {/* Enhanced mobile experience meta tags */}
        <meta name="mobile-web-app-title" content="sayso" />
        <meta name="application-name" content="sayso" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="full-screen" content="yes" />
        <meta name="browsermode" content="application" />
        <meta name="nightmode" content="enable/disable" />
        <meta name="layoutmode" content="fitscreen/standard" />

        {/* PWA Manifest - Icons defined in manifest.json when available */}

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/globals.css" as="style" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
        
        <link rel="canonical" href="/" />
      </head>
      <body className={`${urbanist.className} ${italianno.className} no-layout-shift`}>
        <WebVitals />
        <ClientLayoutWrapper />
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
