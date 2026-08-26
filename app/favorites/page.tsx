"use client";

import { useEffect, useState, useCallback } from "react";
import type { Property } from "@/app/types/property";
import { supabase } from "@/lib/supabase";
import PropertyCard from "../components/PropertyCard";

export default function FavoritesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);

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
      console.error("HomeLinker favorites error:", error);
      setProperties([]);
      setLoading(false);
      return;
    }

    type FavoriteRow = {
      property_id: number;
      properties?: Property | Property[] | null;
    };

    const props = (data || [])
      .map((item: FavoriteRow) => {
        if (!item.properties) {
          return null;
        }

        // Supabase may return the related property
        // as either an object or an array depending
        // on the relationship.
        if (Array.isArray(item.properties)) {
          return item.properties[0] ?? null;
        }

        return item.properties;
      })
      .filter(
        (property): property is Property =>
          Boolean(property)
      );

    setProperties(props);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadFavorites();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          void loadFavorites();
        } else {
          setProperties([]);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadFavorites]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F6F1]">
        <h1 className="text-3xl font-bold text-[#1B1B1B]">
          Loading...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] py-16">
      <div className="mx-auto max-w-7xl px-6">

        <h1 className="mb-3 text-5xl font-bold text-[#1B1B1B]">
          My Favorites ❤️
        </h1>

        <p className="mb-10 text-gray-700">
          {properties.length} saved{" "}
          {properties.length === 1
            ? "property"
            : "properties"}
        </p>

        {properties.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-lg">
            <h2 className="text-3xl font-bold text-[#1B1B1B]">
              No saved properties yet.
            </h2>

            <p className="mt-4 text-gray-600">
              Browse properties and tap the ❤️ to save them.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {properties.map((property) => (
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
            ))}
          </div>
        )}

      </div>
    </main>
  );
}