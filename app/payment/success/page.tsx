"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function activateListing() {
      try {
        const propertyId = sessionStorage.getItem("propertyId");

        if (!propertyId) {
          setLoading(false);
          return;
        }

        const { error } = await supabase
          .from("properties")
          .update({
            status: "active",
            plan: "premium",
          })
          .eq("id", propertyId);

        if (error) {
          throw error;
        }

        sessionStorage.removeItem("propertyId");

        setSuccess(true);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }

    activateListing();
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F6F1] flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-12 text-center">

        <div className="text-6xl">
          🎉
        </div>

        <h1 className="text-5xl font-black mt-6">
          Payment Successful
        </h1>

        {loading && (
          <p className="mt-6 text-gray-600">
            Activating your listing...
          </p>
        )}

        {!loading && success && (
          <p className="mt-6 text-green-600 text-lg">
            Your listing is now live!
          </p>
        )}

        {!loading && !success && (
          <p className="mt-6 text-red-600 text-lg">
            We couldn't activate your listing.
          </p>
        )}

        <Link
          href="/dashboard"
          className="block mt-10 bg-[#C9A227] text-white py-4 rounded-xl font-bold hover:bg-[#A67C00]"
        >
          Go to Dashboard
        </Link>

      </div>
    </main>
  );
}