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

const cityNames: Record<string, string> = {
  florida: "Florida",
  roodepoort: "Roodepoort",
  soweto: "Soweto",
  johannesburg: "Johannesburg",
  randburg: "Randburg",
  pretoria: "Pretoria",
};

function getCityName(slug: string) {
  return (
    cityNames[slug.toLowerCase()] ||
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { city } = await params;
  const cityName = getCityName(city);

  return {
    title: `Properties to Rent in ${cityName} | HomeLinker`,
    description: `Find rooms, apartments, houses and other properties to rent in ${cityName}, South Africa on HomeLinker.`,
    alternates: {
      canonical: `https://homelinker.co.za/rent/${city.toLowerCase()}`,
    },
    openGraph: {
      title: `Properties to Rent in ${cityName} | HomeLinker`,
      description: `Find rooms, apartments, houses and properties to rent in ${cityName}, South Africa.`,
      url: `https://homelinker.co.za/rent/${city.toLowerCase()}`,
      siteName: "HomeLinker",
      type: "website",
    },
  };
}

export default async function CityRentPage({ params }: Props) {
  const { city } = await params;
  const cityName = getCityName(city);

  const allProperties = await getProperties();

  const properties = allProperties.filter((property: Property) => {
    return (
      property.city?.trim().toLowerCase() === cityName.trim().toLowerCase()
    );
  });

  return (
    <main className="min-h-screen bg-[#F8F6F1]">
      {/* HERO */}
      <section className="border-b border-[#E8D8A5] bg-[#FFFDF8]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
          <Link
            href="/properties"
            className="text-sm font-semibold text-[#A67C00] hover:text-[#C9A227]"
          >
            ← Browse all properties
          </Link>

          <div className="mt-7 max-w-4xl">
            <div className="inline-flex rounded-full bg-[#C9A227]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-[#A67C00]">
              HomeLinker • South Africa
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-[#1B1B1B] sm:text-5xl lg:text-6xl">
              Properties to rent in {cityName}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Discover rooms, apartments, houses and other rental properties
              available in {cityName}. Browse HomeLinker listings and find a
              place that fits your budget and lifestyle.
            </p>
          </div>
        </div>
      </section>

      {/* LISTINGS */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#C9A227]">
              Rental listings
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#1B1B1B]">
              Homes available in {cityName}
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            {properties.length}{" "}
            {properties.length === 1 ? "listing" : "listings"} found
          </p>
        </div>

        {properties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property: Property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                slug={property.slug}
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
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-[#E8D8A5] bg-white px-6 py-16 text-center">
            <h2 className="text-2xl font-black text-[#1B1B1B]">
              No rental listings yet
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              There are currently no properties listed in {cityName}. Check
              back soon or browse all HomeLinker properties.
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
            Find a home to rent in {cityName}
          </h2>

          <p className="mt-4 leading-8 text-slate-600">
            Looking for a place to rent in {cityName}? HomeLinker makes it
            easier to discover rental accommodation across South Africa.
            Explore available rooms, apartments and houses, compare prices
            and view property details before contacting the owner.
          </p>

          <p className="mt-4 leading-8 text-slate-600">
            Whether you are looking for an affordable room, an apartment for
            yourself or a family home, browse the latest properties available
            in {cityName} on HomeLinker.
          </p>
        </div>
      </section>
    </main>
  );
}