"use client";

import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] flex items-center justify-center px-6">

      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-12 text-center">

        <div className="w-24 h-24 mx-auto rounded-full bg-red-100 flex items-center justify-center text-5xl">
          ❌
        </div>

        <h1 className="mt-8 text-5xl font-black text-[#1B1B1B]">
          Payment Cancelled
        </h1>

        <p className="mt-6 text-lg text-gray-600 leading-8">
          Your payment was not completed.
          <br />
          No money has been charged to your account.
        </p>

        <div className="mt-10 rounded-2xl bg-[#F8F6F1] p-6">

          <h2 className="text-2xl font-bold text-[#1B1B1B]">
            You can still continue
          </h2>

          <ul className="mt-6 space-y-4 text-left text-gray-700">

            <li>✔ Return to Checkout and try again.</li>

            <li>✔ Choose a different listing plan.</li>

            <li>✔ Your property details are still saved.</li>

          </ul>

        </div>

        <div className="mt-10 flex flex-col gap-4">

          <Link
            href="/pricing"
            className="bg-[#C9A227] hover:bg-[#B08A1B] text-white py-4 rounded-xl font-bold text-lg transition"
          >
            Return to Pricing
          </Link>

          <Link
            href="/"
            className="border border-gray-300 hover:bg-gray-100 py-4 rounded-xl font-bold transition"
          >
            Back to Home
          </Link>

        </div>

      </div>

    </main>
  );
}