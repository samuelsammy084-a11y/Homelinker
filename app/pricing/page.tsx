"use client";

import {
  Suspense,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Crown,
  Sparkles,
  ArrowLeft,
  Building2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function PricingContent() {
  const searchParams = useSearchParams();

  const propertyId =
    searchParams.get("propertyId") ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("propertyId")
      : null);

  const [loadingPlan, setLoadingPlan] =
    useState<
      "free" | "premium" | "pro" | null
    >(null);

  // ==================================================
  // FREE PLAN
  // ==================================================

  async function startFreePlan() {
    if (!propertyId) {
      alert(
        "No property was found. Please go back and post your property again."
      );
      return;
    }

    setLoadingPlan("free");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error(
          "Free plan session error:",
          sessionError
        );

        alert(
          "Unable to verify your login. Please sign in again."
        );

        return;
      }

      if (!session?.access_token) {
        alert(
          "Please sign in before publishing your listing."
        );

        const returnUrl =
          `/pricing?propertyId=${encodeURIComponent(
            String(propertyId)
          )}`;

        window.location.href =
          `/login?redirect=${encodeURIComponent(
            returnUrl
          )}`;

        return;
      }

      const response = await fetch(
        "/api/activate-free-listing",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${session.access_token}`,
          },

          body: JSON.stringify({
            propertyId,
          }),
        }
      );

      let data: {
        success?: boolean;
        propertyId?: number;
        status?: string;
        plan?: string;
        error?: string;
      } = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok || !data.success) {
        console.error(
          "Free plan activation API error:",
          data
        );

        alert(
          data.error ||
            "The property could not be activated."
        );

        return;
      }

      sessionStorage.removeItem(
        "propertyId"
      );

      window.location.href =
        "/dashboard";
    } catch (error) {
      console.error(
        "Free plan activation error:",
        error
      );

      alert(
        "Something went wrong activating your listing."
      );
    } finally {
      setLoadingPlan(null);
    }
  }

  // ==================================================
  // PREMIUM / PRO CHECKOUT
  // ==================================================

  async function checkout(
    plan: "premium" | "pro"
  ) {
    if (!propertyId) {
      alert(
        "No property was found. Please go back and post your property again."
      );
      return;
    }

    setLoadingPlan(plan);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error(
          "Checkout session error:",
          sessionError
        );

        alert(
          "Unable to verify your login. Please sign in again."
        );

        return;
      }

      if (!session?.access_token) {
        alert(
          "Please sign in before purchasing a plan."
        );

        const returnUrl =
          `/pricing?propertyId=${encodeURIComponent(
            String(propertyId)
          )}`;

        window.location.href =
          `/login?redirect=${encodeURIComponent(
            returnUrl
          )}`;

        return;
      }

      const response = await fetch(
        "/api/create-checkout-session",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${session.access_token}`,
          },

          body: JSON.stringify({
            plan,
            propertyId,
          }),
        }
      );

      let data: {
        url?: string;
        error?: string;
        code?: string;
        verificationUrl?: string;
        expiresAt?: string;
      } = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        console.error(
          "Checkout API error:",
          data
        );

        if (
          data.code ===
          "IDENTITY_VERIFICATION_REQUIRED"
        ) {
          const shouldVerify =
            window.confirm(
              "HomeLinker requires identity verification before purchasing Premium or Pro.\n\nWould you like to verify your identity now?"
            );

          if (shouldVerify) {
            window.location.href =
              data.verificationUrl ||
              "/verify";
          }

          return;
        }

        if (
          data.code ===
          "PRO_ALREADY_ACTIVE"
        ) {
          alert(
            "Your HomeLinker Pro package is already active. You can manage your Pro properties from your dashboard."
          );

          window.location.href =
            "/dashboard";

          return;
        }

        alert(
          data.error ||
            "Failed to create checkout session."
        );

        return;
      }

      if (
        !data.url ||
        typeof data.url !== "string"
      ) {
        alert(
          "Payment page could not be created."
        );

        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      alert(
        "Something went wrong starting payment."
      );
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* ============================================
          HEADER
      ============================================ */}

      <div className="mb-12 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C9A227]/10">
          <Crown
            size={34}
            className="text-[#C9A227]"
          />
        </div>

        <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-[#C9A227]">
          HomeLinker Advertising
        </p>

        <h1 className="text-4xl font-black text-[#111111] sm:text-5xl">
          Choose How You Want to List
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#666666]">
          Start free or give your
          properties stronger visibility with
          HomeLinker Premium or Pro.
        </p>

        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-[#E8D9A8] bg-[#FFF9E8] p-4 text-sm leading-6 text-[#6B5A20]">
          Your property has been saved but is{" "}
          <strong>not live yet.</strong>{" "}
          Choose a plan below to publish it.
        </div>
      </div>

      {/* ============================================
          PRICING CARDS
      ============================================ */}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ==========================================
            FREE
        ========================================== */}

        <div className="flex flex-col rounded-[32px] border border-[#E5E5E5] bg-white p-8 shadow-lg">
          <div className="mb-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F5F5]">
              <Building2
                size={24}
                className="text-[#111111]"
              />
            </div>

            <h2 className="text-2xl font-black text-[#111111]">
              Free
            </h2>

            <p className="mt-2 leading-6 text-[#666666]">
              Everything you need to get
              your property onto HomeLinker.
            </p>
          </div>

          <div className="mb-3">
            <span className="text-5xl font-black text-[#111111]">
              R0
            </span>
          </div>

          <p className="mb-8 text-sm text-[#777777]">
            No payment required
          </p>

          <div className="mb-5 border-t border-[#EEEEEE]" />

          <ul className="mb-10 space-y-4 text-sm text-[#444444]">
            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              Normal HomeLinker listing
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              Property photos
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              Search visibility
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              Map and location information
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              WhatsApp and contact options
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              HomeLinker dashboard
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

        {/* ==========================================
            PREMIUM
        ========================================== */}

        <div className="relative flex flex-col rounded-[32px] border-2 border-[#C9A227] bg-white p-8 shadow-2xl">
          <div className="absolute right-6 top-6 rounded-full bg-[#C9A227] px-4 py-2 text-xs font-black uppercase tracking-wide text-black">
            Popular
          </div>

          <div className="mb-6 pr-20">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A227]/10">
              <Sparkles
                size={24}
                className="text-[#C9A227]"
              />
            </div>

            <h2 className="text-2xl font-black text-[#111111]">
              Premium
            </h2>

            <p className="mt-2 leading-6 text-[#666666]">
              Give one important property
              stronger visibility for 30 days.
            </p>
          </div>

          <div className="mb-2">
            <span className="text-5xl font-black text-[#111111]">
              R240
            </span>
          </div>

          <p className="mb-8 text-sm font-semibold text-[#777777]">
            one property • 30 days
          </p>

          <div className="mb-5 border-t border-[#EEEEEE]" />

          <ul className="mb-10 space-y-4 text-sm text-[#444444]">
            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              Everything included in Free
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              Premium promoted listing
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              Enhanced visibility
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              Featured placement eligibility
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#C9A227]" />
              30 days of paid promotion
            </li>
          </ul>

          <button
            onClick={() =>
              checkout("premium")
            }
            disabled={loadingPlan !== null}
            className="mt-auto w-full rounded-2xl bg-[#C9A227] py-4 font-black text-black transition hover:bg-[#B8921F] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingPlan === "premium"
              ? "Opening Secure Payment..."
              : "Choose Premium — R240"}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-[#888888]">
            Applies to the property you are
            currently publishing.
          </p>
        </div>

        {/* ==========================================
            PRO
        ========================================== */}

        <div className="relative flex flex-col overflow-hidden rounded-[32px] border border-[#2A2A2A] bg-[#111111] p-8 text-white shadow-2xl">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#C9A227]/10 blur-2xl" />

          <div className="relative mb-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A227] text-black">
              <Crown size={25} />
            </div>

            <h2 className="text-2xl font-black">
              Pro
            </h2>

            <p className="mt-2 leading-6 text-gray-300">
              Built for landlords and agents
              managing multiple properties.
            </p>
          </div>

          <div className="relative mb-2">
            <span className="text-5xl font-black">
              R550
            </span>
          </div>

          <p className="relative mb-8 text-sm font-semibold text-gray-400">
            advertiser account • 30 days
          </p>

          <div className="relative mb-5 border-t border-white/10" />

          <ul className="relative mb-10 space-y-4 text-sm text-gray-200">
            <li className="flex gap-3">
              <Check className="shrink-0 text-[#E5C65B]" />
              Pro advertiser package
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#E5C65B]" />
              Promote up to 10 active
              properties
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#E5C65B]" />
              First property promoted
              immediately after payment
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#E5C65B]" />
              Up to 3 Priority Property
              slots
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#E5C65B]" />
              Enhanced visibility for
              promoted properties
            </li>

            <li className="flex gap-3">
              <Check className="shrink-0 text-[#E5C65B]" />
              30-day Pro access
            </li>
          </ul>

          <button
            onClick={() =>
              checkout("pro")
            }
            disabled={loadingPlan !== null}
            className="relative mt-auto w-full rounded-2xl bg-[#C9A227] py-4 font-black text-black transition hover:bg-[#E0BA38] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingPlan === "pro"
              ? "Opening Secure Payment..."
              : "Choose Pro — R550"}
          </button>

          <p className="relative mt-4 text-center text-xs leading-5 text-gray-400">
            One-time 30-day package. No
            automatic recurring subscription.
          </p>
        </div>
      </div>

      {/* ============================================
          TRUST MESSAGE
      ============================================ */}

      <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-[#E8D9A8] bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#C9A227]/10">
            <ShieldCheck
              size={23}
              className="text-[#C9A227]"
            />
          </div>

          <div>
            <h3 className="font-black text-[#111111]">
              Trust cannot be bought
            </h3>

            <p className="mt-1 text-sm leading-6 text-[#666666]">
              Premium and Pro increase
              advertising visibility. They do
              not purchase an Identity Verified
              or Property Verified badge.
              HomeLinker verification is handled
              separately.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================
          BACK
      ============================================ */}

      <div className="mt-10 text-center">
        <Link
          href="/post-listing"
          className="inline-flex items-center gap-2 font-semibold text-[#666666] transition hover:text-[#C9A227]"
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