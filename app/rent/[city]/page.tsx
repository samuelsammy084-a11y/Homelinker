import type { Metadata } from "next";
import Link from "next/link";
import PropertyCard from "@/app/components/PropertyCard";
import { getProperties } from "@/lib/getProperties";
import type { Property } from "@/app/types/property";

type Props = {
  params: Promise<{
    city: string;
  }>;
};

// Must match metadataBase in app/layout.tsx and SITE_URL used across
// the rest of the site — keeps SEO signals on one consistent domain.
const SITE_URL = "https://www.homelinker.co.za";

function slugToCityName(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
}

function cityToSlug(city: string) {
  return city
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { city } = await params;
  const cityName = slugToCityName(city);

  const title = `Houses, Apartments & Rooms to Rent in ${cityName} | HomeLinker`;

  const description =
    `Find houses, apartments, flats, rooms and other properties to rent in ${cityName}, South Africa. Browse rental listings on HomeLinker and find your next home.`;

  const canonicalUrl =
    `${SITE_URL}/rent/${city.toLowerCase()}`;

  return {
    title,
    description,

    keywords: [
      `houses for rent in ${cityName}`,
      `houses to rent in ${cityName}`,
      `apartments for rent in ${cityName}`,
      `apartments to rent in ${cityName}`,
      `flats for rent in ${cityName}`,
      `flats to rent in ${cityName}`,
      `rooms for rent in ${cityName}`,
      `rooms to rent in ${cityName}`,
      `property for rent in ${cityName}`,
      `property to rent in ${cityName}`,
      `properties for rent in ${cityName}`,
      `properties to rent in ${cityName}`,
      `rental properties in ${cityName}`,
      `${cityName} rental properties`,
      "houses for rent South Africa",
      "apartments for rent South Africa",
      "rooms for rent South Africa",
      "property to rent South Africa",
      "properties to rent South Africa",
      "South Africa property",
      "HomeLinker",
    ],

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "HomeLinker",
      locale: "en_ZA",
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `Properties to rent in ${cityName} on HomeLinker`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CityRentPage({
  params,
}: Props) {
  const { city } = await params;
  const cityName = slugToCityName(city);

  const allProperties = await getProperties();

  const properties = allProperties.filter(
    (property: Property) => {
      if (!property.city) return false;

      return (
        cityToSlug(property.city) ===
          city.toLowerCase() &&
        property.listing_type === "rent"
      );
    }
  );

  const propertyTypes = Array.from(
    new Set(
      properties
        .map((property) =>
          property.property_type?.trim()
        )
        .filter(Boolean)
    )
  );

  const canonicalUrl =
    `${SITE_URL}/rent/${city.toLowerCase()}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `Properties to Rent in ${cityName}`,
        description:
          `Find houses, apartments, flats, rooms and rental properties in ${cityName}, South Africa on HomeLinker.`,
        url: canonicalUrl,
        isPartOf: {
          "@type": "WebSite",
          name: "HomeLinker",
          url: SITE_URL,
        },
        about: {
          "@type": "Thing",
          name: `Rental properties in ${cityName}`,
        },
      },

      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Properties",
            item: `${SITE_URL}/properties`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `Properties to Rent in ${cityName}`,
            item: canonicalUrl,
          },
        ],
      },

      ...(properties.length > 0
        ? [
            {
              "@type": "ItemList",
              name: `Rental properties in ${cityName}`,
              numberOfItems: properties.length,
              itemListElement: properties
                .slice(0, 50)
                .map(
                  (
                    property: Property,
                    index: number
                  ) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: property.title,
                    url: property.slug
                      ? `${SITE_URL}/properties/${property.slug}`
                      : `${SITE_URL}/properties`,
                  })
                ),
            },
          ]
        : []),
    ],
  };

  return (
    <main className="min-h-screen bg-[#F8F6F1]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      {/* HERO */}
      <section className="border-b border-[#E8D8A5] bg-[#F8F6F1]">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <Link
            href="/properties"
            className="inline-flex items-center font-bold text-[#A67C00] transition hover:text-[#C9A227]"
          >
            ← Browse all properties
          </Link>

          <div className="mt-7 max-w-4xl">
            <div className="inline-flex rounded-full bg-[#C9A227]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-[#A67C00]">
              HomeLinker • South Africa
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-[#1B1B1B] sm:text-5xl lg:text-6xl">
              Properties to Rent in {cityName}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Find houses, apartments, flats, rooms and
              other rental properties available in{" "}
              {cityName}, South Africa. Browse HomeLinker
              listings, compare properties and find a place
              that fits your budget and lifestyle.
            </p>
          </div>
        </div>
      </section>

      {/* LISTINGS */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#C9A227]">
              Rental properties
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#1B1B1B]">
              Homes to Rent in {cityName}
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            {properties.length}{" "}
            {properties.length === 1
              ? "listing"
              : "listings"}{" "}
            found
          </p>
        </div>

        {/* PROPERTY TYPES FOUND */}
        {propertyTypes.length > 0 ? (
          <div className="mb-8 flex flex-wrap gap-2">
            {propertyTypes.map((propertyType) => (
              <span
                key={propertyType}
                className="rounded-full border border-[#E8D8A5] bg-white px-4 py-2 text-sm font-semibold text-slate-700"
              >
                {propertyType} to rent
              </span>
            ))}
          </div>
        ) : null}

        {properties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map(
              (property: Property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  slug={property.slug}
                  status={property.status}
                  images={
                    property.image_urls?.length
                      ? property.image_urls
                      : [
                          property.image_url ||
                            "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d",
                        ]
                  }
                  price={property.price}
                  title={property.title}
                  location={`${property.city}, ${property.province}`}
                  bedrooms={property.bedrooms ?? 0}
                  bathrooms={property.bathrooms ?? 0}
                  parking={property.parking ?? 0}
                  featured={property.featured}
                  verified={property.verified}
                />
              )
            )}
          </div>
        ) : (
          <div className="rounded-3xl border border-[#E8D8A5] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF9E8] text-2xl">
              🏠
            </div>

            <h2 className="mt-5 text-2xl font-black text-[#1B1B1B]">
              No rental listings yet
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              There are currently no properties to rent
              listed in {cityName}. Check back soon or browse
              all HomeLinker properties across South Africa.
            </p>

            <Link
              href="/properties"
              className="mt-7 inline-flex rounded-xl bg-[#C9A227] px-6 py-3 font-bold text-black transition hover:bg-[#A67C00]"
            >
              Browse all properties
            </Link>
          </div>
        )}
      </section>

      {/* SEO CONTENT */}
      <section className="border-t border-[#E8D8A5] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className="text-2xl font-black text-[#1B1B1B]">
            Find a property to rent in {cityName}
          </h2>

          <p className="mt-4 leading-8 text-slate-600">
            Looking for a house, apartment, flat or room to
            rent in {cityName}, South Africa? HomeLinker helps
            you discover rental properties across cities,
            suburbs and provinces throughout South Africa.
          </p>

          <p className="mt-4 leading-8 text-slate-600">
            Whether you need an affordable room, a modern
            apartment or a family house, browse available
            rental properties in {cityName}, compare prices
            and view property details before contacting the
            owner.
          </p>

          <h2 className="mt-10 text-2xl font-black text-[#1B1B1B]">
            Houses, apartments and rooms to rent
          </h2>

          <p className="mt-4 leading-8 text-slate-600">
            HomeLinker brings different types of rental
            properties together in one South African property
            marketplace. Search for houses, apartments, flats,
            rooms and other accommodation based on the location
            and property that suits your needs.
          </p>

          <p className="mt-4 leading-8 text-slate-600">
            HomeLinker is a South African property marketplace
            where property owners can list homes, rooms and
            other properties for people looking to rent or buy
            across South Africa.
          </p>
        </div>
      </section>
    </main>
  );
}