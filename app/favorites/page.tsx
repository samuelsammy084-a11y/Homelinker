"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import type { Property } from "@/app/types/property";
import { supabase } from "@/lib/supabase";
import PropertyCard from "../components/PropertyCard";

type FavoriteRow = {
  property_id: number;
  properties?: Property | Property[] | null;
};

export default function FavoritesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState<boolean | null>(
    null
  );

  const loadFavorites = useCallback(async () => {
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(
          "HomeLinker favorites auth error:",
          userError
        );

        setProperties([]);
        setSignedIn(false);
        return;
      }

      if (!user) {
        setProperties([]);
        setSignedIn(false);
        return;
      }

      setSignedIn(true);

      /*
       * IMPORTANT:
       *
       * Do not use:
       *
       *   properties (*)
       *
       * The properties table contains fields that should
       * not automatically be exposed through public/client
       * queries.
       *
       * Only select the fields PropertyCard needs.
       */
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          property_id,
          properties (
            id,
            title,
            price,
            city,
            province,
            property_type,
            bedrooms,
            bathrooms,
            parking,
            image_url,
            image_urls,
            featured,
            verified,
            status,
            listing_type,
            created_at
          )
        `)
        .eq("user_id", user.id);

      if (error) {
        console.error(
          "HomeLinker favorites error:",
          error
        );

        setProperties([]);
        return;
      }

      const favoriteProperties = (
        (data || []) as FavoriteRow[]
      )
        .map((item) => {
          if (!item.properties) {
            return null;
          }

          if (Array.isArray(item.properties)) {
            return item.properties[0] ?? null;
          }

          return item.properties;
        })
        .filter(
          (property): property is Property =>
            Boolean(property)
        );

      setProperties(favoriteProperties);
    } catch (error) {
      console.error(
        "Unexpected HomeLinker favorites error:",
        error
      );

      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFavorites();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setSignedIn(true);
          void loadFavorites();
        } else {
          setSignedIn(false);
          setProperties([]);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [loadFavorites]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F6F1] px-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E8D8A5] border-t-[#C9A227]" />

          <p className="mt-4 font-semibold text-[#1B1B1B]">
            Loading your favorites...
          </p>
        </div>
      </main>
    );
  }

  if (signedIn === false) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg sm:p-12">
            <div className="text-5xl">❤️</div>

            <h1 className="mt-5 text-3xl font-bold text-[#1B1B1B] sm:text-4xl">
              Your Favorites
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-gray-600">
              Sign in to save properties you like and view
              them again from your favorites.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
              >
                Sign In
              </Link>

              <Link
                href="/properties"
                className="rounded-xl border border-[#1B1B1B] px-6 py-3 font-semibold text-[#1B1B1B] transition hover:bg-[#1B1B1B] hover:text-white"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="mb-3 text-4xl font-bold text-[#1B1B1B] sm:text-5xl">
          My Favorites ❤️
        </h1>

        <p className="mb-10 text-gray-700">
          {properties.length} saved{" "}
          {properties.length === 1
            ? "property"
            : "properties"}
        </p>

        {properties.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg sm:p-12">
            <div className="text-5xl">♡</div>

            <h2 className="mt-5 text-2xl font-bold text-[#1B1B1B] sm:text-3xl">
              No saved properties yet.
            </h2>

            <p className="mt-4 text-gray-600">
              Browse HomeLinker and tap the heart on a
              property you want to save.
            </p>

            <Link
              href="/properties"
              className="mt-8 inline-flex rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                slug={property.slug}
                status={property.status}
                listingType={property.listing_type}
                images={
                  property.image_urls?.length
                    ? property.image_urls
                    : [
                        property.image_url ||
                          "/og-image.png",
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