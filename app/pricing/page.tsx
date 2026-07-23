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

          <div className="inline-block border-2 border-[#C9A227] text-[#C9A227] px-6 py-2 rounded-full font-bold tracking-widest uppercase text-sm bg-white shadow-sm">
            HomeLinker Pricing
          </div>

          <h1 className="mt-8 text-6xl md:text-7xl font-black text-[#1B1B1B] leading-tight">
            Choose Your
            <br />
            Listing Plan
          </h1>

          <div className="w-24 h-1 bg-[#C9A227] rounded-full mx-auto mt-8"></div>

          <p className="mt-8 max-w-2xl mx-auto text-xl text-[#1B1B1B] leading-9">
            Publish your property and reach thousands of renters across South Africa.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-stretch">

          {/* FREE */}

          <div className="bg-white rounded-[32px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[#ECECEC] p-10">

            <h2 className="text-4xl font-black text-[#1B1B1B]">
              Free
            </h2>

            <h3 className="text-7xl font-black mt-8 text-[#1B1B1B]">
              R0
            </h3>

            <p className="mt-3 text-[#1B1B1B] font-medium">
              Perfect for first-time landlords.
            </p>

            <ul className="space-y-5 mt-10 text-lg text-[#1B1B1B]">
              <li>✔ 1 Property Listing</li>
              <li>✔ 7 Days Live</li>
              <li>✔ Basic Search Visibility</li>
            </ul>

            <button
              onClick={startFreePlan}
              className="w-full mt-12 border-2 border-[#C9A227] text-[#C9A227] py-4 rounded-xl font-bold text-lg hover:bg-[#C9A227] hover:text-white transition"
            >
              Start Free
            </button>

          </div>

          {/* PREMIUM */}

          <div className="relative bg-[#1B1B1B] rounded-[36px] border-4 border-[#C9A227] shadow-2xl scale-105 overflow-hidden">

            <div className="absolute top-0 left-0 right-0 bg-[#C9A227] py-3 text-center font-black text-[#1B1B1B] tracking-widest uppercase">
              ⭐ Most Popular
            </div>

            <div className="p-10 pt-20 text-white">

              <h2 className="text-4xl font-black">
                Premium
              </h2>

              <h3 className="text-7xl font-black mt-8 text-[#C9A227]">
                R49
              </h3>

              <p className="mt-3 text-white/80 text-lg">
                One-time payment per listing.
              </p>

              <ul className="space-y-5 mt-10 text-lg">
                <li>✔ Featured Listing</li>
                <li>✔ 30 Days Live</li>
                <li>✔ Verified Badge</li>
                <li>✔ Priority Search Ranking</li>
              </ul>

              <button
                onClick={() => checkout("premium")}
                className="w-full mt-12 bg-[#C9A227] hover:bg-[#B08A1B] text-white py-4 rounded-xl font-bold text-lg transition"
              >
                Choose Premium
              </button>

            </div>

          </div>

          {/* PRO */}

          <div className="bg-white rounded-[32px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[#ECECEC] p-10">

            <h2 className="text-4xl font-black text-[#1B1B1B]">
              Landlord Pro
            </h2>

            <h3 className="text-7xl font-black mt-8 text-[#1B1B1B]">
              R199
            </h3>

            <p className="mt-3 text-[#1B1B1B] font-medium">
              For professional landlords.
            </p>

            <ul className="space-y-5 mt-10 text-lg text-[#1B1B1B]">
              <li>✔ Unlimited Listings</li>
              <li>✔ Analytics Dashboard</li>
              <li>✔ Featured Listings</li>
              <li>✔ Priority Support</li>
            </ul>

            <button
              onClick={() => checkout("pro")}
              className="w-full mt-12 bg-[#1B1B1B] hover:bg-black text-white py-4 rounded-xl font-bold text-lg transition"
            >
              Go Pro
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}