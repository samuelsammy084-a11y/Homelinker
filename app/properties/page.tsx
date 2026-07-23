import PropertyCard from "../components/PropertyCard";
import PropertySearchBar from "../components/PropertySearchBar";
import { getProperties } from "@/lib/getProperties";

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

  let properties = await getProperties();

  // Filter by Province
  if (params.province) {
    properties = properties.filter(
      (p: any) => p.province === params.province
    );
  }

  // Filter by City
  if (params.city) {
    const search = params.city.toLowerCase();

    properties = properties.filter((p: any) =>
      p.city?.toLowerCase().includes(search)
    );
  }

  // Filter by Property Type
  if (params.type) {
    properties = properties.filter(
      (p: any) => p.property_type === params.type
    );
  }

  // Filter by Maximum Price
  if (params.maxPrice) {
    properties = properties.filter(
      (p: any) => Number(p.price) <= Number(params.maxPrice)
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] py-16">
      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-5xl font-bold text-black mb-3">
          Browse Properties
        </h1>

        <p className="text-black mb-8">
          Find your next home anywhere in South Africa.
        </p>

        <div className="mb-8">
          <PropertySearchBar sticky />
        </div>

        <p className="text-black font-semibold mb-8">
          {properties.length} properties found
        </p>

        {properties.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-black">
              No properties found
            </h2>

            <p className="text-gray-600 mt-4">
              Try changing your search filters.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {properties.map((property: any) => (
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
        )}

      </div>
    </main>
  );
}