import type { Metadata } from "next";
import type { Property } from "@/app/types/property";
import PropertyCard from "../components/PropertyCard";
import PropertySearchBar from "../components/PropertySearchBar";
import PropertyFilters from "../components/PropertyFilters";
import { getProperties } from "@/lib/getProperties";

const SITE_URL = "https://www.homelinker.co.za";

export const metadata: Metadata = {
  title: "Properties for Sale & Rent Across South Africa | HomeLinker",
  description:
    "Find houses, apartments, flats, rooms and properties to rent or buy anywhere in South Africa. Browse property listings across cities, suburbs and provinces on HomeLinker.",
  alternates: {
    canonical: `${SITE_URL}/properties`,
  },
  openGraph: {
    title: "Properties for Sale & Rent Across South Africa | HomeLinker",
    description:
      "Find houses, apartments, flats, rooms and properties to rent or buy anywhere in South Africa on HomeLinker.",
    url: `${SITE_URL}/properties`,
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
    title: "Properties for Sale & Rent Across South Africa | HomeLinker",
    description:
      "Find houses, apartments, flats, rooms and properties to rent or buy anywhere in South Africa on HomeLinker.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

type Props = {
  searchParams: Promise<{
    province?: string;
    city?: string;
    type?: string;
    maxPrice?: string;
  }>;
};

export default async function PropertiesPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const properties = await getProperties({
    province: params.province,
    city: params.city,
    type: params.type,
    maxPrice: params.maxPrice
      ? Number(params.maxPrice)
      : undefined,
  });

  return (
    <main className="min-h-screen bg-[#F8F6F1]">
      <div className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">

        {/* HEADER */}
        <div className="mb-5 sm:mb-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227] sm:text-sm">
                Explore HomeLinker
              </p>

              <h1 className="text-3xl font-black tracking-tight text-black sm:text-5xl">
                Browse Properties
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:mt-3 sm:text-base">
                Find your next home anywhere in South Africa.
              </p>
            </div>

            <div className="hidden rounded-2xl bg-white px-4 py-3 text-right shadow-sm sm:block">
              <p className="text-2xl font-black text-[#C9A227]">
                {properties.length}
              </p>

              <p className="text-xs font-semibold text-slate-500">
                properties
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-4 rounded-2xl border border-[#E9E1CA] bg-white p-2 shadow-sm sm:mb-5 sm:rounded-3xl sm:p-4">
          <PropertySearchBar sticky />
        </div>

        {/* FILTERS */}
        <div className="mb-5 sm:mb-8">
          <PropertyFilters />
        </div>

        {/* RESULTS */}
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <div>
            <p className="text-sm font-bold text-black sm:text-base">
              {properties.length}{" "}
              {properties.length === 1
                ? "property"
                : "properties"}{" "}
              found
            </p>

            <p className="mt-0.5 text-xs text-slate-500 sm:hidden">
              Scroll down to explore properties
            </p>
          </div>
        </div>

        {/* NO RESULTS */}
        {properties.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg sm:p-12">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF9E8] text-2xl">
              🏠
            </div>

            <h2 className="mt-5 text-2xl font-bold text-black sm:text-3xl">
              No properties found
            </h2>

            <p className="mt-3 text-sm text-gray-600 sm:text-base">
              Try changing your search filters.
            </p>

          </div>
        ) : (
          <>
            {/* MOBILE - 1 LISTING PER ROW */}
            <div className="grid grid-cols-1 gap-3 sm:hidden">

              {properties.map((property: Property) => (
                <div
                  key={property.id}
                  className="min-w-0"
                >
                  <PropertyCard
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
                    phoneNumber={property.contact_phone}
                  />
                </div>
              ))}

            </div>

            {/* LAPTOP / DESKTOP - 3 LISTINGS PER ROW */}
            <div className="hidden sm:grid sm:grid-cols-3 sm:gap-6">

              {properties.map((property: Property) => (
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
                  phoneNumber={property.contact_phone}
                />
              ))}

            </div>
          </>
        )}

      </div>
    </main>
  );
}