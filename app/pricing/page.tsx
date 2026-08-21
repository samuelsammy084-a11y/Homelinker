"use client";

import { supabase } from "@/lib/supabase";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PricingContent() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");

  async function startFreePlan() {
    const targetId = propertyId || sessionStorage.getItem("propertyId");

    if (!targetId) {
      alert("No property found to activate. Please list a property first.");
      return;
    }

    const { error } = await supabase
      .from("properties")
      .update({
        status: "active",
        // @ts-ignore
        plan: "free",
      })
      .eq("id", targetId);

    if (error) {
      alert(error.message);
      return;
    }

    sessionStorage.removeItem("propertyId");
    window.location.href = "/dashboard";
  }

  async function checkout(plan: "premium" | "pro") {
    const targetId = propertyId || sessionStorage.getItem("propertyId");

    if (!targetId && plan !== "pro") {
      alert("Please select a property to promote first.");
      return;
    }

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          propertyId: targetId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to create checkout session.");
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
// ... existing code ...
    </div>
  );
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] py-20 px-6">
      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <PricingContent />
      </Suspense>
    </main>
  );
}