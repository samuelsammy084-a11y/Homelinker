import type { Metadata } from "next";
import Hero from "./components/Hero";
import FeaturedProperties from "./components/FeaturedProperties";
import PopularAreas from "./components/PopularAreas";
import WhyChooseUs from "./components/WhyChooseUs";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title:
    "HomeLinker | South Africa's Property Marketplace",

  description:
    "Find houses, apartments, flats, rooms and properties to rent or buy across South Africa. Browse property listings by city, suburb and province on HomeLinker.",

  keywords: [
    "property South Africa",
    "properties South Africa",
    "houses for sale South Africa",
    "houses for rent South Africa",
    "property for sale South Africa",
    "property to rent South Africa",
    "apartments for sale South Africa",
    "apartments to rent South Africa",
    "flats for sale South Africa",
    "flats to rent South Africa",
    "rooms for rent South Africa",
    "South African property marketplace",
    "buy property South Africa",
    "rent property South Africa",
    "HomeLinker",
  ],

  alternates: {
    canonical: "https://homelinker.co.za",
  },

  openGraph: {
    title:
      "HomeLinker | South Africa's Property Marketplace",

    description:
      "Find houses, apartments, flats, rooms and properties to rent or buy across South Africa. Browse property listings on HomeLinker.",

    url: "https://homelinker.co.za",
    siteName: "HomeLinker",
    locale: "en_ZA",
    type: "website",

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

    title:
      "HomeLinker | South Africa's Property Marketplace",

    description:
      "Find houses, apartments, flats, rooms and properties to rent or buy across South Africa on HomeLinker.",

    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://homelinker.co.za/#website",
      name: "HomeLinker",
      alternateName: "HomeLinker South Africa",
      url: "https://homelinker.co.za/",
      description:
        "South African property marketplace for finding properties to rent or buy.",
      inLanguage: "en-ZA",
      publisher: {
        "@id": "https://homelinker.co.za/#organization",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://homelinker.co.za/#organization",
      name: "HomeLinker",
      url: "https://homelinker.co.za/",
      logo: {
        "@type": "ImageObject",
        url: "https://homelinker.co.za/icon.png",
      },
      description:
        "HomeLinker is a South African property marketplace where people can find houses, apartments, flats, rooms and other properties to rent or buy.",
    },
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FCFAF5_0%,#F8F6F1_100%)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <Hero />
      <FeaturedProperties />
      <PopularAreas />
      <WhyChooseUs />
      <Footer />
    </main>
  );
}