"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BedDouble,
  Bath,
  CarFront,
  House,
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
  Heart,
  MessageCircle,
  Search,
  Bell,
  Building2,
  UserCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { Property } from "@/app/types/property";

type Role =
  | "home_seeker"
  | "property_owner"
  | "estate_agent";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>("home_seeker");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setLoading(false);
          return;
        }

        setUser(user);

        const { data: profile, error: profileError } =
          await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle();

        if (profileError) {
          console.error(
            "HomeLinker profile error:",
            profileError
          );
        }

        const userRole =
          (profile?.role as Role | null) ??
          "home_seeker";

        setRole(userRole);

        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          console.error(
            "HomeLinker properties error:",
            error
          );

          toast.error(
            "Unable to load your properties."
          );

          setProperties([]);
        } else {
          setProperties((data ?? []) as Property[]);
        }
      } catch (error) {
        console.error(
          "HomeLinker dashboard error:",
          error
        );

        toast.error(
          "Something went wrong loading your dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  async function handleDeleteProperty(
    propertyId: number
  ) {
    if (!user) {
      toast.error("You must be logged in.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this property?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    setDeletingId(propertyId);

    try {
      const { data, error } = await supabase
        .from("properties")
        .delete()
        .eq("id", propertyId)
        .eq("user_id", user.id)
        .select("id");

      if (error) {
        console.error(
          "HomeLinker delete property error:",
          error
        );

        toast.error(
          `Could not delete property: ${error.message}`
        );

        return;
      }

      if (!data || data.length === 0) {
        console.error(
          "Delete returned zero rows. Check Supabase RLS DELETE policy."
        );

        toast.error(
          "The property was not deleted. Please check your account permissions."
        );

        return;
      }

      setProperties((current) =>
        current.filter(
          (property) => property.id !== propertyId
        )
      );

      toast.success(
        "Property deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Unexpected property deletion error:",
        error
      );

      toast.error(
        "Something went wrong deleting the property."
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[32px] border border-[#F0E7CF] bg-white p-10 text-center shadow-lg">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#C9A227]/20 border-t-[#C9A227]" />

            <h1 className="mt-6 text-2xl font-bold text-[#1B1B1B]">
              Loading your HomeLinker dashboard...
            </h1>

            <p className="mt-2 text-slate-600">
              Just a moment.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-[32px] border border-[#F0E7CF] bg-white p-10 text-center shadow-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
              <Building2 size={28} />
            </div>

            <h1 className="mt-6 text-3xl font-black text-[#1B1B1B]">
              Please log in first
            </h1>

            <p className="mt-3 text-slate-600">
              Sign in to access your HomeLinker account.
            </p>

            <Link
              href="/login"
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[#C9A227] px-8 py-3 font-semibold text-white transition hover:bg-[#A67C00]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
   * HOME SEEKER DASHBOARD
   */
  if (
    role === "home_seeker" &&
    properties.length === 0
  ) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#FCFAF5_0%,#F8F6F1_100%)] px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">

          {/* TOP NAVIGATION */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-semibold text-slate-600 transition hover:text-[#C9A227]"
            >
              <ArrowLeft size={16} />
              HomeLinker
            </Link>

            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#C9A227] bg-white px-5 py-3 font-bold text-[#1B1B1B] shadow-sm transition hover:bg-[#FFF9E8]"
            >
              <UserCircle
                size={19}
                className="text-[#C9A227]"
              />
              Profile
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[32px] bg-[#111111] p-6 shadow-xl sm:p-10"
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#C9A227]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#C9A227]">
                  <House size={14} />
                  Home Seeker
                </div>

                <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                  Welcome to HomeLinker
                </h1>

                <p className="mt-3 max-w-xl text-slate-300">
                  Find a place you'll love to call home.
                  Browse properties, save your favourites,
                  and chat directly with owners and agents.
                </p>
              </div>

              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C9A227] px-6 py-3 font-bold text-white transition hover:bg-[#A67C00]"
              >
                <Search size={18} />
                Find a Home
              </Link>
            </div>
          </motion.div>

          {/* QUICK ACTIONS */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-5">
            <DashboardAction
              href="/properties"
              icon={<Search size={22} />}
              title="Find a Home"
              description="Browse properties"
              primary
            />

            <DashboardAction
              href="/favorites"
              icon={<Heart size={22} />}
              title="My Favorites"
              description="Saved properties"
            />

            <DashboardAction
              href="/messages"
              icon={<MessageCircle size={22} />}
              title="My Messages"
              description="Chat with owners"
            />

            <DashboardAction
              href="/notifications"
              icon={<Bell size={22} />}
              title="Notifications"
              description="See your updates"
            />

            <DashboardAction
              href="/profile"
              icon={<UserCircle size={22} />}
              title="My Profile"
              description="Edit your account"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 rounded-[32px] border border-[#F0E7CF] bg-white p-6 shadow-[0_20px_70px_-30px_rgba(0,0,0,0.2)] sm:p-8"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-[#1B1B1B]">
                  Looking for your next home?
                </h2>

                <p className="mt-2 text-slate-600">
                  Start browsing properties across South
                  Africa and contact the people listing them.
                </p>
              </div>

              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C9A227] px-5 py-3 font-semibold text-[#1B1B1B] transition hover:bg-[#FFF9E8]"
              >
                Browse Properties
                <ArrowLeft
                  size={16}
                  className="rotate-180"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  /*
   * PROPERTY OWNER / ESTATE AGENT DASHBOARD
   */

  const isAgent = role === "estate_agent";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FCFAF5_0%,#F8F6F1_100%)] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">

        {/* TOP NAVIGATION */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold text-slate-600 transition hover:text-[#C9A227]"
          >
            <ArrowLeft size={16} />
            HomeLinker
          </Link>

          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-2xl border border-[#C9A227] bg-white px-5 py-3 font-bold text-[#1B1B1B] shadow-sm transition hover:bg-[#FFF9E8]"
          >
            <UserCircle
              size={19}
              className="text-[#C9A227]"
            />
            Profile
          </Link>
        </div>

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-6 rounded-[32px] border border-[#F0E7CF] bg-white/80 p-6 shadow-[0_20px_70px_-30px_rgba(0,0,0,0.22)] backdrop-blur sm:mb-10 sm:p-8 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#C9A227]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#A67C00]">
              {isAgent ? (
                <Building2 size={14} />
              ) : (
                <House size={14} />
              )}

              {isAgent
                ? "Estate Agent"
                : "Property Owner"}
            </div>

            <h1 className="mt-4 text-3xl font-black text-[#1B1B1B] sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 text-base text-slate-600 sm:text-lg">
              {isAgent
                ? "Manage your property listings and enquiries."
                : "Manage your properties and communicate with potential tenants and buyers."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/post-listing"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C9A227] px-6 py-3 font-semibold text-white transition hover:bg-[#A67C00]"
            >
              <Plus size={16} />
              Post New Property
            </Link>
          </div>
        </motion.div>

        {/* QUICK ACTIONS */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:mb-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-5">
          <DashboardAction
            href="/post-listing"
            icon={<Plus size={22} />}
            title="Add Property"
            description="Create a new listing"
            primary
          />

          <DashboardAction
            href="/messages"
            icon={<MessageCircle size={22} />}
            title="Messages"
            description="Talk to buyers & renters"
          />

          <DashboardAction
            href="/notifications"
            icon={<Bell size={22} />}
            title="Notifications"
            description="See new enquiries"
          />

          <DashboardAction
            href="/properties"
            icon={<House size={22} />}
            title="Marketplace"
            description="See public listings"
          />

          <DashboardAction
            href="/profile"
            icon={<UserCircle size={22} />}
            title="My Profile"
            description="Edit your account"
          />
        </div>

        {/* LISTINGS HEADER */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#1B1B1B] sm:text-3xl">
              My Listings
            </h2>

            <p className="mt-1 text-slate-600">
              You have{" "}
              <strong>{properties.length}</strong>{" "}
              {properties.length === 1
                ? "property"
                : "properties"}{" "}
              listed.
            </p>
          </div>

          {properties.length > 0 && (
            <Link
              href="/post-listing"
              className="inline-flex items-center gap-2 font-semibold text-[#A67C00] hover:underline"
            >
              <Plus size={16} />
              Add another
            </Link>
          )}
        </div>

        {/* NO LISTINGS */}
        {properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] border border-[#F0E7CF] bg-white p-8 text-center shadow-[0_20px_70px_-30px_rgba(0,0,0,0.2)] sm:p-16"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
              {isAgent ? (
                <Building2 size={28} />
              ) : (
                <House size={28} />
              )}
            </div>

            <h2 className="mt-6 text-2xl font-black text-[#1B1B1B] sm:text-3xl">
              No properties yet
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-base text-slate-600 sm:text-lg">
              {isAgent
                ? "Create your first property listing and start connecting with potential clients."
                : "Post your first property and start receiving enquiries from people looking for a home."}
            </p>

            <Link
              href="/post-listing"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C9A227] px-8 py-3 font-semibold text-white transition hover:bg-[#A67C00]"
            >
              <Plus size={18} />
              Post Property
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-2 lg:gap-8">
            {properties.map((property) => {
              const image =
                property.image_urls?.length
                  ? property.image_urls[0]
                  : property.image_url ||
                    "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d";

              const isDeleting =
                deletingId === property.id;

              return (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_15px_50px_-30px_rgba(0,0,0,0.22)] sm:rounded-[30px]"
                >
                  {/* IMAGE */}
                  <div className="relative aspect-[4/3] w-full sm:aspect-video sm:h-64">
                    <Image
                      src={image}
                      alt={property.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />

                    <div className="absolute left-2 top-2 flex max-w-[80%] flex-wrap gap-1 sm:left-4 sm:top-4 sm:gap-2">
                      {property.featured && (
                        <span className="rounded-full bg-[#C9A227] px-2 py-1 text-[7px] font-bold uppercase tracking-wide text-white shadow sm:px-3 sm:py-1.5 sm:text-[11px] sm:tracking-[0.2em]">
                          Featured
                        </span>
                      )}

                      {property.verified && (
                        <span className="rounded-full bg-emerald-600 px-2 py-1 text-[7px] font-bold uppercase tracking-wide text-white shadow sm:px-3 sm:py-1.5 sm:text-[11px] sm:tracking-[0.2em]">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-3 sm:p-7">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="line-clamp-2 text-sm font-bold leading-5 text-[#1B1B1B] sm:text-2xl sm:leading-7">
                          {property.title}
                        </h2>

                        <p className="mt-1 line-clamp-1 text-[9px] text-slate-600 sm:mt-2 sm:text-sm">
                          📍 {property.city},{" "}
                          {property.province}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-xl font-black text-[#C9A227] sm:mt-6 sm:text-4xl">
                      R
                      {Number(
                        property.price
                      ).toLocaleString("en-ZA")}
                    </p>

                    <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-6 sm:gap-3">
                      <PropertyStat
                        icon={<BedDouble size={14} />}
                        value={property.bedrooms ?? 0}
                        label="Beds"
                      />

                      <PropertyStat
                        icon={<Bath size={14} />}
                        value={property.bathrooms ?? 0}
                        label="Baths"
                      />

                      <PropertyStat
                        icon={<CarFront size={14} />}
                        value={property.parking ?? 0}
                        label="Parking"
                      />
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-3 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:gap-3">
                      <Link
                        href={`/edit-listing/${property.id}`}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-2 py-2.5 text-[9px] font-semibold text-white transition hover:bg-slate-700 sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
                      >
                        <Pencil size={13} />
                        Edit
                      </Link>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() =>
                          handleDeleteProperty(
                            property.id
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 px-2 py-2.5 text-[9px] font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
                      >
                        <Trash2 size={13} />

                        {isDeleting
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* PROFILE REMINDER */}
        <div className="mt-8 rounded-[32px] border border-[#E8D9A8] bg-[#FFF9E8] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#C9A227]/15 text-[#C9A227]">
                <UserCircle size={25} />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1B1B1B]">
                  Keep your profile up to date
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Add your name, phone number and profile
                  picture so people know who they are
                  dealing with.
                </p>
              </div>
            </div>

            <Link
              href="/profile"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#C9A227] px-6 py-3 font-bold text-white transition hover:bg-[#A67C00]"
            >
              <UserCircle size={18} />
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

/*
 * DASHBOARD ACTION
 */
function DashboardAction({
  href,
  icon,
  title,
  description,
  primary = false,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-2xl border p-3 transition sm:rounded-[26px] sm:p-6 ${
        primary
          ? "border-[#C9A227] bg-[#C9A227] text-white shadow-[0_15px_40px_-20px_rgba(201,162,39,0.8)] hover:bg-[#A67C00]"
          : "border-[#F0E7CF] bg-white text-[#1B1B1B] shadow-[0_15px_50px_-30px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:border-[#C9A227]"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl sm:h-12 sm:w-12 sm:rounded-2xl ${
          primary
            ? "bg-white/15"
            : "bg-[#C9A227]/10 text-[#C9A227]"
        }`}
      >
        {icon}
      </div>

      <h3 className="mt-3 text-sm font-bold sm:mt-5 sm:text-lg">
        {title}
      </h3>

      <p
        className={`mt-1 text-[10px] sm:text-sm ${
          primary
            ? "text-white/75"
            : "text-slate-500"
        }`}
      >
        {description}
      </p>
    </Link>
  );
}

/*
 * PROPERTY STAT
 */
function PropertyStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-[#F8F6F1] py-2 text-center sm:rounded-2xl sm:py-3">
      <div className="mx-auto flex justify-center text-[#C9A227]">
        {icon}
      </div>

      <p className="mt-1 text-xs font-bold text-[#1B1B1B] sm:mt-2 sm:text-base">
        {value}
      </p>

      <p className="text-[6px] uppercase tracking-wide text-slate-500 sm:text-[11px] sm:tracking-[0.2em]">
        {label}
      </p>
    </div>
  );
}