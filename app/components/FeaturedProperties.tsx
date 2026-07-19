import PropertyCard from "./PropertyCard";
import { getProperties } from "@/lib/getProperties";
import Link from "next/link";

export default async function FeaturedProperties() {
  const properties = await getProperties();

  // Show featured properties first.
  // If none are featured, show the latest 6.
  const featured = properties.filter((p: any) => p.featured);

  const displayProperties =
    featured.length > 0 ? featured : properties.slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[#C9A227] font-semibold uppercase tracking-wider">
            Featured
          </p>

          <h2 className="text-4xl font-bold text-black mt-2">
            Latest Properties
          </h2>
        </div>

        <Link
          href="/properties"
          className="text-[#C9A227] font-semibold hover:underline"
        >
          View All →
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {displayProperties.map((property: any) => (
          <PropertyCard
            key={property.id}
            id={property.id}
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
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            parking={property.parking}
            featured={property.featured}
            verified={property.verified}
          />
        ))}
      </div>
    </section>
  );
}