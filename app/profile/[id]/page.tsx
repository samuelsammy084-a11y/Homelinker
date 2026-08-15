"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string | null;
  is_verified: boolean | null;
};

type Property = {
  id: number;
  title: string;
  city: string | null;
  province: string | null;
  price: number;
  image_url: string | null;
};

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { id } = await params;

      setProfileId(id);

      try {
        const { data: profileData, error: profileError } =
          await supabase
            .from("profiles")
            .select(
              "id, full_name, avatar_url, bio, role, is_verified"
            )
            .eq("id", id)
            .maybeSingle();

        if (profileError) {
          console.error(
            "HomeLinker public profile error:",
            profileError
          );
          setLoading(false);
          return;
        }

        if (!profileData) {
          setLoading(false);
          return;
        }

        setProfile(profileData);

        const { data: propertyData, error: propertyError } =
          await supabase
            .from("properties")
            .select(
              "id, title, city, province, price, image_url"
            )
            .eq("user_id", id)
            .eq("status", "active")
            .order("created_at", {
              ascending: false,
            });

        if (propertyError) {
          console.error(
            "HomeLinker public profile properties error:",
            propertyError
          );
        } else {
          setProperties(propertyData ?? []);
        }
      } catch (error) {
        console.error(
          "HomeLinker public profile loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, [params]);

  function getInitials(name: string) {
    return (
      name
        .trim()
        .split(/\s+/)
        .map((word) => word[0])
        .filter(Boolean)
        .join("")
        .slice(0, 2)
        .toUpperCase() || "HL"
    );
  }

  function getRoleLabel(role: string | null) {
    if (role === "estate_agent") return "Estate Agent";
    if (role === "property_owner") return "Property Owner";
    return "Home Seeker";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="text-lg font-semibold text-slate-600">
              Loading profile...
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h1 className="text-3xl font-black text-black">
              Profile not found
            </h1>

            <p className="mt-3 text-slate-500">
              This HomeLinker profile could not be found.
            </p>

            <Link
              href="/messages"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-6 py-3 font-bold text-black"
            >
              <ArrowLeft size={18} />
              Back to Messages
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const name =
    profile.full_name?.trim() || "HomeLinker User";

  const initials = getInitials(name);

  return (
    <main className="min-h-screen bg-[#F8F6F1] px-4 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <Link
          href="/messages"
          className="mb-6 inline-flex items-center gap-2 font-semibold text-slate-600 transition hover:text-[#C9A227]"
        >
          <ArrowLeft size={18} />
          Back to Messages
        </Link>

        {/* PROFILE HEADER */}
        <section className="overflow-hidden rounded-[32px] bg-[#111111] shadow-xl">
          <div className="p-7 sm:p-10">

            <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left">

              {/* Avatar */}
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#C9A227] bg-[#C9A227]/10 sm:h-32 sm:w-32">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-3xl font-black text-[#C9A227]">
                    {initials}
                  </span>
                )}
              </div>

              {/* Name */}
              <div className="mt-6 sm:ml-7 sm:mt-0">

                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <h1 className="text-3xl font-black text-white sm:text-4xl">
                    {name}
                  </h1>

                  {profile.is_verified && (
                    <CheckCircle2
                      size={24}
                      className="text-[#C9A227]"
                    />
                  )}
                </div>

                <p className="mt-2 text-slate-300">
                  {getRoleLabel(profile.role)}
                </p>

                {profile.is_verified && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#C9A227]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#C9A227]">
                    <CheckCircle2 size={14} />
                    Verified Profile
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-black text-black">
            About
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            {profile.bio?.trim() ||
              `${name} is a HomeLinker user.`}
          </p>
        </section>

        {/* LISTINGS */}
        <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-black">
                Properties
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Properties listed by {name}
              </p>
            </div>

            <span className="rounded-full bg-[#C9A227]/10 px-3 py-1 text-sm font-bold text-[#A67C00]">
              {properties.length}
            </span>
          </div>

          {properties.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-[#FFFDF8] p-8 text-center">
              <p className="font-semibold text-slate-600">
                No active properties yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {properties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="overflow-hidden rounded-2xl border border-slate-200 transition hover:-translate-y-1 hover:border-[#C9A227] hover:shadow-md"
                >
                  <div className="relative h-48 bg-slate-100">
                    {property.image_url ? (
                      <Image
                        src={property.image_url}
                        alt={property.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="truncate font-bold text-black">
                      {property.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {property.city}
                      {property.province
                        ? `, ${property.province}`
                        : ""}
                    </p>

                    <p className="mt-3 font-black text-[#A67C00]">
                      R
                      {Number(
                        property.price
                      ).toLocaleString("en-ZA")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* MESSAGE BUTTON */}
        <div className="mt-6">
          <Link
            href={`/messages?user=${profileId}`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#C9A227] px-6 py-4 font-bold text-black transition hover:bg-[#b89520]"
          >
            <MessageCircle size={20} />
            Message {name}
          </Link>
        </div>

        <div className="pb-8 pt-8 text-center text-sm text-slate-400">
          HomeLinker • Your trusted property marketplace
        </div>
      </div>
    </main>
  );
}