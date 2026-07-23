"use client";

import { supabase } from "@/lib/supabase";

export default function PricingPage() {
  async function startFreePlan() {
    const propertyId = sessionStorage.getItem("propertyId");

    if (!propertyId) {
      alert("Property not found.");
      return;
    }

    const { error } = await supabase
      .from("properties")
      .update({
        status: "active",
        plan: "free",
      })
      .eq("id", propertyId);

    if (error) {
      alert(error.message);
      return;
    }

    sessionStorage.removeItem("propertyId");

    window.location.href = "/dashboard";
  }

  async function checkout(plan: "premium" | "pro") {
    const propertyId = sessionStorage.getItem("propertyId");

    if (!propertyId) {
      alert("Property not found.");
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
          propertyId,
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
    <main className="min-h-screen bg-[#F8F6F1] py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-20">
          <h1 className="text-6xl font-black text-[#1B1B1B]">
            Choose Your Listing Plan
          </h1>

          <p className="mt-6 text-xl text-gray-600">
            Select the package that best suits your property.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* FREE */}

          <div className="bg-white rounded-3xl shadow-xl p-10">

            <h2 className="text-4xl font-bold">Free</h2>

            <h3 className="text-6xl font-black mt-6">
              R0
            </h3>

            <ul className="space-y-4 mt-8 text-black">
              <li>✔ 1 Listing</li>
              <li>✔ 7 Days</li>
              <li>✔ Basic Visibility</li>
            </ul>

            <button
              onClick={startFreePlan}
              className="w-full mt-10 border-2 border-[#C9A227] text-[#C9A227] py-4 rounded-xl font-bold hover:bg-[#C9A227] hover:text-white"
            >
              Start Free
            </button>

          </div>

          {/* PREMIUM */}

          <div className="bg-[#1B1B1B] rounded-3xl p-10 text-white border-4 border-[#C9A227]">

            <h2 className="text-4xl font-bold">
              Premium
            </h2>

            <h3 className="text-6xl font-black mt-6 text-[#C9A227]">
              R49
            </h3>

            <ul className="space-y-4 mt-8">
              <li>✔ Featured Listing</li>
              <li>✔ 30 Days</li>
              <li>✔ Verified Badge</li>
              <li>✔ Priority Search</li>
            </ul>

            <button
              onClick={() => checkout("premium")}
              className="w-full mt-10 bg-[#C9A227] py-4 rounded-xl font-bold"
            >
              Choose Premium
            </button>

          </div>

          {/* PRO */}

          <div className="bg-white rounded-3xl shadow-xl p-10">

            <h2 className="text-4xl font-bold">
              Landlord Pro
            </h2>

            <h3 className="text-6xl font-black mt-6">
              R199
            </h3>

            <ul className="space-y-4 mt-8 text-black">
              <li>✔ Unlimited Listings</li>
              <li>✔ Analytics</li>
              <li>✔ Featured Listings</li>
            </ul>

            <button
              onClick={() => checkout("pro")}
              className="w-full mt-10 bg-black text-white py-4 rounded-xl font-bold"
            >
              Go Pro
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}