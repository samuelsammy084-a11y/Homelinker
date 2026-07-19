"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PropertyCard from "../components/PropertyCard";

export default function FavoritesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("favorites")
      .select(`
        property_id,
        properties (*)
      `)
      .eq("user_id", user.id);

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    const props =
      data?.map((item: any) => item.properties).filter(Boolean) || [];

    setProperties(props);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] py-16">
      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-5xl font-bold text-[#1B1B1B] mb-3">
          My Favorites ❤️
        </h1>

        <p className="text-gray-700 mb-10">
          {properties.length} saved properties
        </p>

        {properties.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-[#1B1B1B]">
              No saved properties yet.
            </h2>

            <p className="text-gray-600 mt-4">
              Browse properties and tap the ❤️ to save them.
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