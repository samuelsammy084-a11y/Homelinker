"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const plan = searchParams.get("plan") || "premium";

  const plans = {
    premium: {
      name: "Premium Listing",
      price: 49,
      duration: "30 Days",
    },
    pro: {
      name: "Landlord Pro",
      price: 199,
      duration: "Monthly Subscription",
    },
  };

  const selected = plan === "pro" ? plans.pro : plans.premium;

  return (
    <main className="min-h-screen bg-[#F8F6F1] py-20 px-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-3xl shadow-xl p-10">
          <h1 className="text-5xl font-black text-[#1B1B1B]">Checkout</h1>
          <p className="mt-3 text-gray-600">You&apos;re almost done.</p>

          <div className="mt-10 rounded-2xl border p-6">
            <h2 className="text-2xl font-bold">{selected.name}</h2>
            <p className="mt-2 text-gray-600">{selected.duration}</p>
            <h3 className="mt-8 text-5xl font-black text-[#C9A227]">
              R{selected.price}
            </h3>
          </div>

          <div className="mt-8 space-y-3 text-lg">
            <p>✔ Secure Checkout</p>
            <p>✔ SSL Encrypted</p>
            <p>✔ Instant Activation After Payment</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-10">
          <h2 className="text-3xl font-bold">Order Summary</h2>

          <div className="flex justify-between mt-10 text-xl">
            <span>{selected.name}</span>
            <span>R{selected.price}</span>
          </div>

          <hr className="my-8" />

          <div className="flex justify-between text-3xl font-black">
            <span>Total</span>
            <span className="text-[#C9A227]">R{selected.price}</span>
          </div>

          <button
            onClick={() => alert("PayFast will be connected next.")}
            className="w-full mt-10 bg-[#C9A227] hover:bg-[#B08A1B] text-white py-5 rounded-xl text-xl font-bold transition"
          >
            Pay Now
          </button>

          <button
            onClick={() => router.back()}
            className="w-full mt-4 border border-gray-300 py-4 rounded-xl font-semibold hover:bg-gray-100"
          >
            Back
          </button>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F8F6F1] py-20 px-6">
          <div className="max-w-5xl mx-auto text-center text-gray-600">
            Loading checkout...
          </div>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}