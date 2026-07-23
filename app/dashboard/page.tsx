"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setProperties(data || []);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F8F6F1]">
        <h1 className="text-3xl font-bold text-[#1B1B1B]">
          Loading your listings...
        </h1>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F8F6F1]">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
          <h1 className="text-4xl font-bold text-[#1B1B1B]">
            Please login first
          </h1>

          <Link
            href="/login"
            className="inline-block mt-6 bg-[#C9A227] hover:bg-[#A67C00] text-white px-8 py-4 rounded-xl font-bold transition"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12">
          <div>
            <h1 className="text-5xl font-extrabold text-[#1B1B1B]">
              My Listings
            </h1>

            <p className="text-gray-600 mt-3 text-lg">
              You have{" "}
              <span className="font-bold text-[#C9A227]">
                {properties.length}
              </span>{" "}
              properties listed.
            </p>
          </div>

          <Link
            href="/post-listing"
            className="mt-6 md:mt-0 bg-[#C9A227] hover:bg-[#A67C00] text-white px-8 py-4 rounded-xl font-bold transition hover:shadow-xl"
          >
            + Post New Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
            <div className="text-7xl mb-6">??</div>

            <h2 className="text-4xl font-bold text-[#1B1B1B]">
              No Properties Yet
            </h2>

            <p className="text-gray-600 mt-4 text-lg">
              Post your first property and start receiving enquiries.
            </p>

            <Link
              href="/post-listing"
              className="inline-block mt-8 bg-[#C9A227] hover:bg-[#A67C00] text-white px-8 py-4 rounded-xl font-bold transition"
            >
              Post Property
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {properties.map((property) => {
              const image =
                property.image_urls?.length
                  ? property.image_urls[0]
                  : property.image_url ||
                    "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d";

              return (
                <div
                  key={property.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <img
                    src={image}
                    alt={property.title}
                    className="w-full h-64 object-cover"
                  />

                  <div className="p-7">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-3xl font-bold text-[#1B1B1B]">
                          {property.title}
                        </h2>

                        <p className="text-gray-500 mt-2">
                          ?? {property.city}, {property.province}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        {property.featured && (
                          <span className="bg-[#C9A227] text-white px-3 py-1 rounded-full text-xs font-bold">
                            ? Featured
                          </span>
                        )}

                        {property.verified && (
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                            ? Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-[#C9A227] text-4xl font-extrabold mt-6">
                      R{Number(property.price).toLocaleString("en-ZA")}
                    </p>

                    <div className="grid grid-cols-3 gap-3 mt-6">
                      <div className="bg-[#F8F6F1] rounded-xl py-3 text-center">
                        ??<br />
                        <span className="font-bold">{property.bedrooms}</span>
                      </div>

                      <div className="bg-[#F8F6F1] rounded-xl py-3 text-center">
                        ??<br />
                        <span className="font-bold">{property.bathrooms}</span>
                      </div>

                      <div className="bg-[#F8F6F1] rounded-xl py-3 text-center">
                        ??<br />
                        <span className="font-bold">{property.parking}</span>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                      <Link
                        href={`/edit-listing/${property.id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-center font-bold transition"
                      >
                        ?? Edit
                      </Link>

                      <button
                        onClick={async () => {
                          const confirmDelete = confirm(
                            "Are you sure you want to delete this property?"
                          );

                          if (!confirmDelete) return;

                          const { error } = await supabase
                            .from("properties")
                            .delete()
                            .eq("id", property.id);

                          if (error) {
                            toast.error(error.message);
                            return;
                          }

                          setProperties(
                            properties.filter((p) => p.id !== property.id)
                          );

                          toast.success("Property deleted successfully!");
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition"
                      >
                        ?? Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
