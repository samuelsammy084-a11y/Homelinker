"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
        .eq("user_id", user.id);

      setProperties(data || []);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Please login first.
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] py-16">
      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-5xl font-bold mb-2">
          My Listings
        </h1>

        <p className="text-gray-600 mb-10">
          {properties.length} properties
        </p>

        <div className="space-y-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl shadow p-6 flex justify-between items-center"
            >
              <div>
                <h2 className="text-2xl font-bold">
                  {property.title}
                </h2>

                <p className="text-gray-500">
                  {property.city}, {property.province}
                </p>

                <p className="text-[#C9A227] font-bold text-xl mt-2">
                  R{property.price}
                </p>
              </div>

              <div className="flex gap-3">
                <Link
  href={`/edit-listing/${property.id}`}
  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
>
  Edit
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
      alert(error.message);
      return;
    }

    setProperties(
      properties.filter((p) => p.id !== property.id)
    );

    alert("Property deleted!");
  }}
  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
>
  Delete
</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}