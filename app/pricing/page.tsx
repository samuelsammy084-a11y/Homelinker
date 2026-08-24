"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Check, Crown, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function PricingContent() {
  const searchParams = useSearchParams();

  const propertyId =
    searchParams.get("propertyId") ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("propertyId")
      : null);

  const [loadingPlan, setLoadingPlan] = useState<
    "free" | "premium" | "pro" | null
  >(null);

  async function startFreePlan() {
    if (!propertyId) {
      alert(
        "No property was found. Please go back and post your property again."
      );
      return;
    }

    setLoadingPlan("free");

    try {
      const { data: updatedProperty, error } = await supabase
        .from("properties")
        .update({
          status: "active",
          plan: "free",
        })
        .eq("id", propertyId)
        .select("id")
        .single();

      if (error) {
        console.error("Free plan activation error:", error);
        alert(error.message);
        return;
      }

      if (!updatedProperty) {
        alert("The property could not be activated.");
        return;
      }

      sessionStorage.removeItem("propertyId");

      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      alert("Something went wrong activating your listing.");
    } finally {
      setLoadingPlan(null);
    }
  }

  async function checkout(plan: "premium" | "pro") {
    if (!propertyId) {
      alert(
        "No property was found. Please go back and post your property again."
      );
      return;
    }

    setLoadingPlan(plan);

    try {
      const response = await fetch(
        "/api/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan,
            propertyId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Failed to create checkout session."
        );
        return;
      }

      if (!data.url) {
        alert("Payment page could not be created.");
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert("Something went wrong starting payment.");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* HEADER */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C9A227]/10">
          <Crown
            size={34}
            className="text-[#C9A227]"
          />
        </div>

        <h1 className="text-4xl font-black text-[#111111] sm:text-5xl">
          Choose Your Listing Plan
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-[#666666]">
          Your property has been saved. Choose how you
          want to publish it on HomeLinker.
        </p>

        <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-[#E8D9A8] bg-[#FFF9E8] p-4 text-sm text-[#6B5A20]">
          Your listing is currently saved but{" "}
          <strong>not live</strong>. Choose a plan below
          to activate it.
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* FREE */}
        <div className="flex flex-col rounded-[32px] border border-[#E5E5E5] bg-white p-8 shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-[#111111]">
              Free
            </h2>

            <p className="mt-2 text-[#666666]">
              Get your property listed for free.
            </p>
          </div>

          <div className="mb-8">
            <span className="text-5xl font-black text-[#111111]">
              R0
            </span>

            <span className="ml-2 text-[#777777]">
              / listing
            </span>
          </div>

          <ul className="mb-10 space-y-4 text-sm text-[#444444]">
            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              Property listing
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              Property photos
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              WhatsApp contact
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              Search visibility
            </li>
          </ul>

          <button
            onClick={startFreePlan}
            disabled={loadingPlan !== null}
            className="mt-auto w-full rounded-2xl border-2 border-[#C9A227] py-4 font-bold text-[#111111] transition hover:bg-[#FFF9E8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingPlan === "free"
              ? "Publishing..."
              : "Publish for Free"}
          </button>
        </div>

        {/* PREMIUM */}
        <div className="relative flex flex-col rounded-[32px] border-2 border-[#C9A227] bg-white p-8 shadow-2xl">
          <div className="absolute right-6 top-6 rounded-full bg-[#C9A227] px-4 py-2 text-xs font-black uppercase tracking-wide text-white">
            Popular
          </div>

          <div className="mb-6 pr-20">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles
                size={22}
                className="text-[#C9A227]"
              />

              <span className="font-bold text-[#C9A227]">
                Premium
              </span>
            </div>

            <h2 className="text-2xl font-black text-[#111111]">
              Premium Listing
            </h2>

            <p className="mt-2 text-[#666666]">
              Give your property more visibility.
            </p>
          </div>

          <div className="mb-8">
            <span className="text-5xl font-black text-[#111111]">
              R49
            </span>

            <span className="ml-2 text-[#777777]">
              / listing
            </span>
          </div>

          <ul className="mb-10 space-y-4 text-sm text-[#444444]">
            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              Everything in Free
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              Premium placement
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              More visibility
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              Better exposure to buyers and tenants
            </li>
          </ul>

          <button
            onClick={() => checkout("premium")}
            disabled={loadingPlan !== null}
            className="mt-auto w-full rounded-2xl bg-[#C9A227] py-4 font-bold text-white transition hover:bg-[#A67C00] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingPlan === "premium"
              ? "Opening Payment..."
              : "Choose Premium — R49"}
          </button>
        </div>

        {/* PRO */}
        <div className="flex flex-col rounded-[32px] border border-[#E5E5E5] bg-[#111111] p-8 text-white shadow-xl">
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <Crown
                size={22}
                className="text-[#E5C65B]"
              />

              <span className="font-bold text-[#E5C65B]">
                Pro
              </span>
            </div>

            <h2 className="text-2xl font-black">
              Pro
            </h2>

            <p className="mt-2 text-gray-300">
              For users who want maximum exposure.
            </p>
          </div>

          <div className="mb-8">
            <span className="text-5xl font-black">
              R199
            </span>

            <span className="ml-2 text-gray-400">
              / plan
            </span>
          </div>

          <ul className="mb-10 space-y-4 text-sm text-gray-200">
            <li className="flex gap-3">
              <Check className="shrink-0 text-[#E5C65B]" />
              Premium listing benefits
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#E5C65B]" />
              Maximum exposure
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#E5C65B]" />
              Priority visibility
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#E5C65B]" />
              Ideal for multiple listings
            </li>
          </ul>

          <button
            onClick={() => checkout("pro")}
            disabled={loadingPlan !== null}
            className="mt-auto w-full rounded-2xl bg-[#C9A227] py-4 font-bold text-white transition hover:bg-[#A67C00] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingPlan === "pro"
              ? "Opening Payment..."
              : "Choose Pro — R199"}
          </button>
        </div>
      </div>

      {/* BACK */}
      <div className="mt-10 text-center">
        <Link
          href="/post-listing"
          className="inline-flex items-center gap-2 font-semibold text-[#666666] hover:text-[#C9A227]"
        >
          <ArrowLeft size={18} />
          Back to listing
        </Link>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] px-6 py-16 sm:py-20">
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#C9A227]/20 border-t-[#C9A227]" />

              <p className="mt-4 text-[#666666]">
                Loading plans...
              </p>
            </div>
          </div>
        }
      >
        <PricingContent />
      </Suspense>
    </main>
  );
}