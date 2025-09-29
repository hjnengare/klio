import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { ToastProvider } from "./contexts/ToastContext";
import PageTransitionProvider from "./components/Providers/PageTransitionProvider";
import WebVitals from "./components/Performance/WebVitals";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import AddressBarHide from "./components/MobileUX/AddressBarHide";

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
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "KLIO - Discover trusted KLIO near you",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KLIO - Discover trusted KLIO near you",
    description: "Find amazing local businesses, restaurants, and experiences in your area with personalized recommendations and trusted reviews.",
    images: ["/og.png"],
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
    <html lang="en" data-scroll-behavior="smooth">
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

        {/* PWA iOS Icons */}
        <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />

        {/* iOS Splash Screens */}
        <link rel="apple-touch-startup-image" href="/splash/launch-640x1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/launch-750x1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/launch-1242x2208.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/launch-1125x2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/launch-1284x2778.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/launch-1170x2532.png" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="" />
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
      <body className={`${urbanist.className} mobile-vh-fix mobile-scroll-container`}>
        <AddressBarHide />
        <WebVitals />
        <ErrorBoundary>
          <ToastProvider>
            <AuthProvider>
              <OnboardingProvider>
                <PageTransitionProvider>
                  {children}
                </PageTransitionProvider>
              </OnboardingProvider>
            </AuthProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
