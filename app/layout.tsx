import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://homelinker.co.za"),

  title: {
    default: "HomeLinker | South Africa's Property Marketplace",
    template: "%s | HomeLinker",
  },

  description:
    "Find rooms, apartments, houses, flats and properties to rent or buy anywhere in South Africa. Post your property for free on HomeLinker.",

  keywords: [
    "HomeLinker",
    "South Africa property",
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
      url: "https://homelinker.co.za",
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
    canonical: "https://homelinker.co.za",
  },

  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://homelinker.co.za",
    siteName: "HomeLinker",
    title: "HomeLinker | South Africa's Property Marketplace",
    description:
      "Find rooms, apartments, houses and properties to rent or buy across South Africa.",
    images: [
      {
        url: "/og-image.jpg",
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
      "Find rooms, apartments, houses and properties to rent or buy across South Africa.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  category: "Real Estate",
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
      <body className="min-h-full flex flex-col">
        <Navbar />

        <main className="flex-1">{children}</main>

        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3000}
        />
      </body>

      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
    </html>
  );
}