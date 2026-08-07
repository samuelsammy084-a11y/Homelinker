"use client";

import { useEffect, useState, useCallback } from "react";
import type { Property } from "@/app/types/property";
import { supabase } from "@/lib/supabase";
import PropertyCard from "../components/PropertyCard";

export default function FavoritesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProperties([]);
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

    type FavoriteRow = {
      property_id: number;
      properties?: Property[];
    };

    const props = (data || [])
      .map((item: FavoriteRow) => item.properties?.[0])
      .filter((property): property is Property => Boolean(property));

    setProperties(props);
    setLoading(false);
  }, []);

  useEffect(() => {
    Promise.resolve().then(loadFavorites);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        void loadFavorites();
      } else {
        setProperties([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadFavorites]);

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
        )}

      </div>
    </main>
  );
}