import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
// import GlobalClickSpark from "@/components/GlobalClickSpark";
import LayoutWrapper from "@/components/LayoutWrapper";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { Toaster } from "sonner";
import ChatWidget from "@/components/chat/ChatWidget";
import CookieConsentBanner from "@/components/CookieConsentBanner";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#050b14" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://trisagemarketing.com'),
  title: "NearGrow Ads | Grow Local. Grow Smart. Local Business Marketing Agency",
  description: "NearGrow Ads helps local businesses and regional brands grow through Google Maps optimization, local SEO, Meta & Google Ads, and conversion-focused websites.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48 32x32 16x16', type: 'image/x-icon' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    title: 'NearGrow Ads',
    statusBarStyle: 'default',
    capable: true,
  },
  openGraph: {
    title: "NearGrow Ads | Grow Local. Grow Smart. Local Business Marketing Agency",
    description: "NearGrow Ads helps local businesses and regional brands grow through Google Maps optimization, local SEO, Meta & Google Ads, and conversion-focused websites.",
    url: 'https://trisagemarketing.com',
    siteName: 'NearGrow Ads',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'NearGrow Ads - Local Business Marketing Agency',
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: "NearGrow Ads | Grow Local. Grow Smart. Local Business Marketing Agency",
    description: "NearGrow Ads helps local businesses and regional brands grow through Google Maps optimization, local SEO, Meta & Google Ads, and conversion-focused websites.",
    images: ['/logo.png'],
  },
};

const globalJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://trisagemarketing.com/#website",
      "url": "https://trisagemarketing.com/",
      "name": "NearGrow Ads",
      "description": "NearGrow Ads is a local business growth agency specializing in Google Business Profile optimization, local SEO, Meta & Google Ads, and high-converting websites.",
      "publisher": {
        "@id": "https://trisagemarketing.com/#organization"
      },
      "inLanguage": "en-IN"
    },
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": "https://trisagemarketing.com/#organization",
      "name": "NearGrow Ads",
      "url": "https://trisagemarketing.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://trisagemarketing.com/logo.png",
        "width": 1024,
        "height": 1024
      },
      "image": "https://trisagemarketing.com/logo.png",
      "description": "NearGrow Ads helps local businesses and regional brands in India expand through Google Maps visibility, targeted local ads, and high-converting creative services.",
      "telephone": "+919289810149",
      "email": "info@neargrowads.in",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Pillar no. 781, B-1, Bhagwati Garden Rd, near dwarka mor, Uttam Nagar, Bhagwati Garden, Nawada",
        "addressLocality": "New Delhi",
        "addressRegion": "Delhi",
        "postalCode": "110059",
        "addressCountry": "IN"
      },
      "sameAs": [
        "https://linkedin.com/company/neargrow-ads/",
        "https://instagram.com/neargrowads"
      ],
      "knowsAbout": [
        "Local Business Marketing Agency",
        "Google Business Profile Optimization",
        "Google Maps Marketing",
        "Meta Ads for Local Businesses",
        "Google Search Ads",
        "Local SEO & Citations",
        "Social Media Management & Reels",
        "Landing Page Design & Conversion Optimization"
      ],
      "serviceArea": [
        {
          "@type": "Country",
          "name": "India"
        },
        {
          "@type": "AdministrativeArea",
          "name": "Worldwide"
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap" rel="stylesheet" />
        <link rel="preload" as="image" href="/hero-bg-poster.webp" type="image/webp" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-white dark:bg-[#050b14]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LenisProvider>
            <Toaster
              position="top-center"
              expand={false}
              duration={3500}
              offset={16}
              toastOptions={{
                unstyled: true,
                classNames: {
                  toast: "w-auto max-w-[calc(100vw-24px)] flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/95 dark:bg-[#07111e]/95 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-2xl text-slate-900 dark:text-white font-sans text-[11px] sm:text-xs font-medium z-[9999999] mx-auto shrink-0 whitespace-nowrap overflow-hidden text-ellipsis transition-all",
                  title: "font-semibold text-slate-900 dark:text-white text-[11px] sm:text-xs leading-tight font-sans whitespace-nowrap truncate",
                  description: "text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-normal leading-tight whitespace-nowrap truncate",
                  actionButton: "bg-secondary-500 text-white font-semibold text-[10px] sm:text-xs px-2.5 py-1 rounded-full shrink-0 whitespace-nowrap",
                  cancelButton: "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[10px] sm:text-xs px-2.5 py-1 rounded-full shrink-0 whitespace-nowrap",
                  success: "border-l-4 border-l-emerald-500",
                  error: "border-l-4 border-l-rose-500",
                  info: "border-l-4 border-l-secondary-500",
                  warning: "border-l-4 border-l-amber-500",
                },
              }}
            />
            {/* <GlobalClickSpark /> */}
            <AnalyticsTracker />
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <ChatWidget />
            <CookieConsentBanner />
          </LenisProvider>
        </ThemeProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HHGVZ3JZGV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HHGVZ3JZGV');
          `}
        </Script>
      </body>
    </html>
  );
}
