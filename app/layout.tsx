import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import CookieConsent from "./components/CookieConsent";
import GoogleAnalyticsConsent from "./components/GoogleAnalyticsConsent";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#F8F6F1",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.homelinker.co.za"),

  title: {
    default: "HomeLinker | South Africa's Property Marketplace",
    template: "%s | HomeLinker",
  },

  description:
    "Find rooms, apartments, houses, flats and properties to rent or buy anywhere in South Africa. Post your property for free on HomeLinker.",

  keywords: [
    "HomeLinker",
    "South Africa Property",
    "Property Marketplace",
    "Rooms to Rent",
    "Apartments to Rent",
    "Houses for Sale",
    "Flats to Rent",
    "Student Accommodation",
    "Property Listings",
    "Real Estate South Africa",
    "Rental Properties",
    "Buy Property South Africa",
    "Rent Property South Africa",
  ],

  applicationName: "HomeLinker",

  authors: [
    {
      name: "HomeLinker",
      url: "https://www.homelinker.co.za",
    },
  ],

  creator: "HomeLinker",
  publisher: "HomeLinker",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://www.homelinker.co.za",
  },

  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://www.homelinker.co.za",
    siteName: "HomeLinker",
    title: "HomeLinker | South Africa's Property Marketplace",
    description:
      "Find rooms, apartments, houses, flats and properties to rent or buy across South Africa.",
    images: [
      {
        url: "https://www.homelinker.co.za/og-image.png",
        width: 1200,
        height: 630,
        alt: "HomeLinker - South Africa's Property Marketplace",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "HomeLinker | South Africa's Property Marketplace",
    description:
      "Find rooms, apartments, houses, flats and properties to rent or buy across South Africa.",
    images: ["https://www.homelinker.co.za/og-image.png"],
  },

  icons: {
    icon: "/icon.png",
  },

  category: "Real Estate",

  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_CODE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-ZA"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://ycxbuwgighvqwkrfyanf.supabase.co"
        />
        <link
          rel="dns-prefetch"
          href="https://ycxbuwgighvqwkrfyanf.supabase.co"
        />
      </head>

      <body className="min-h-screen bg-[#F8F6F1]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://www.homelinker.co.za/#organization",
              name: "HomeLinker",
              url: "https://www.homelinker.co.za",
              logo: "https://www.homelinker.co.za/icon.png",
              description:
                "HomeLinker is a South African property marketplace where people can find rooms, apartments, houses, flats and other properties to rent or buy, and property owners can list properties.",
              areaServed: {
                "@type": "Country",
                name: "South Africa",
              },
              knowsAbout: [
                "Property rentals in South Africa",
                "Property sales in South Africa",
                "Rooms to rent",
                "Apartments to rent",
                "Houses for sale",
                "Flats to rent",
                "Student accommodation",
                "South African real estate",
                "Property listings",
              ],
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://www.homelinker.co.za/#website",
              url: "https://www.homelinker.co.za",
              name: "HomeLinker",
              publisher: {
                "@id": "https://www.homelinker.co.za/#organization",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://www.homelinker.co.za/properties?search={search_term_string}",
                },
                "query-input":
                  "required name=search_term_string",
              },
            }),
          }}
        />

        <Navbar />

        <main className="flex-1">{children}</main>

        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3000}
        />

        <GoogleAnalyticsConsent />

        <CookieConsent />
      </body>
    </html>
  );
}