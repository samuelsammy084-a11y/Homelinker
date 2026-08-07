"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { motion } from "framer-motion";
import { BedDouble, Bath, CarFront, House, Plus, ArrowLeft, LoaderCircle, Pencil, Trash2, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { Property } from "@/app/types/property";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
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

      setProperties((data ?? []) as Property[]);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#FCFAF5_0%,#F8F6F1_100%)] px-6">
        <div className="rounded-[32px] border border-[#F0E7CF] bg-white/80 px-10 py-12 text-center shadow-[0_20px_70px_-30px_rgba(0,0,0,0.25)] backdrop-blur">
          <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-[#C9A227]" />
          <h1 className="mt-6 text-3xl font-black text-[#1B1B1B]">Loading your listings...</h1>
          <p className="mt-3 text-slate-600">We’re gathering your properties now.</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#FCFAF5_0%,#F8F6F1_100%)] px-6">
        <div className="max-w-md rounded-[32px] border border-[#F0E7CF] bg-white p-10 text-center shadow-[0_20px_70px_-30px_rgba(0,0,0,0.25)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
            <House size={24} />
          </div>
          <h1 className="mt-6 text-3xl font-black text-[#1B1B1B]">Please login first</h1>
          <p className="mt-3 text-slate-600">Sign in to view and manage your listings.</p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[#C9A227] px-8 py-3 font-semibold text-white transition hover:bg-[#A67C00]"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FCFAF5_0%,#F8F6F1_100%)] py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-10 flex flex-col gap-6 rounded-[32px] border border-[#F0E7CF] bg-white/80 p-8 shadow-[0_20px_70px_-30px_rgba(0,0,0,0.22)] backdrop-blur md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/20 bg-[#C9A227]/10 px-3 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-[#C9A227]">
              <Sparkles size={14} /> Dashboard
            </p>
            <h1 className="mt-4 text-4xl font-black text-[#1B1B1B] sm:text-5xl">My Listings</h1>
            <p className="mt-3 text-lg text-slate-600">
              You have <span className="font-bold text-[#C9A227]">{properties.length}</span> properties listed.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-[#1B1B1B] transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} /> Back to home
            </Link>
            <Link
              href="/post-listing"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C9A227] px-6 py-3 font-semibold text-white transition hover:bg-[#A67C00]"
            >
              <Plus size={16} /> Post new property
            </Link>
          </div>
        </motion.div>

        {properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-[32px] border border-[#F0E7CF] bg-white p-16 text-center shadow-[0_20px_70px_-30px_rgba(0,0,0,0.2)]"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
              <House size={28} />
            </div>
            <h2 className="mt-6 text-3xl font-black text-[#1B1B1B]">No properties yet</h2>
            <p className="mt-3 text-lg text-slate-600">Post your first property and start receiving enquiries.</p>
            <Link
              href="/post-listing"
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[#C9A227] px-8 py-3 font-semibold text-white transition hover:bg-[#A67C00]"
            >
              Post property
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {properties.map((property) => {
              const image =
                property.image_urls?.length
                  ? property.image_urls[0]
                  : property.image_url || "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d";

              return (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_70px_-30px_rgba(0,0,0,0.22)]"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={image}
                      alt={property.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-[#1B1B1B]">{property.title}</h2>
                        <p className="mt-2 text-sm text-slate-600">?? {property.city}, {property.province}</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        {property.featured && (
                          <span className="rounded-full bg-[#C9A227] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                            Featured
                          </span>
                        )}
                        {property.verified && (
                          <span className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-6 text-4xl font-black text-[#C9A227]">
                      R{Number(property.price).toLocaleString("en-ZA")}
                    </p>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <div className="rounded-2xl bg-[#F8F6F1] py-3 text-center">
                        <BedDouble size={16} className="mx-auto text-[#C9A227]" />
                        <p className="mt-2 font-bold text-[#1B1B1B]">{property.bedrooms}</p>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Beds</p>
                      </div>
                      <div className="rounded-2xl bg-[#F8F6F1] py-3 text-center">
                        <Bath size={16} className="mx-auto text-[#C9A227]" />
                        <p className="mt-2 font-bold text-[#1B1B1B]">{property.bathrooms}</p>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Baths</p>
                      </div>
                      <div className="rounded-2xl bg-[#F8F6F1] py-3 text-center">
                        <CarFront size={16} className="mx-auto text-[#C9A227]" />
                        <p className="mt-2 font-bold text-[#1B1B1B]">{property.parking}</p>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Parking</p>
                      </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                      <Link
                        href={`/edit-listing/${property.id}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700"
                      >
                        <Pencil size={16} /> Edit
                      </Link>
                      <button
                        onClick={async () => {
                          const confirmDelete = confirm("Are you sure you want to delete this property?");
                          if (!confirmDelete) return;

                          const { error } = await supabase.from("properties").delete().eq("id", property.id);

                          if (error) {
                            toast.error(error.message);
                            return;
                          }

                          setProperties(properties.filter((p) => p.id !== property.id));
                          toast.success("Property deleted successfully!");
                        }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
