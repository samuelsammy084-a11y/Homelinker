"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/update-password"
          : "https://homelinker.co.za/update-password",
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "✅ Password reset email sent!\n\nPlease check your inbox and follow the link to create a new password."
    );

    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">

        <h1 className="text-4xl font-bold text-center text-slate-900">
          Forgot Password
        </h1>

        <p className="mt-3 text-center text-slate-600">
          Enter your email address and we&apos;ll send you a password reset link.
        </p>

        <form onSubmit={handleReset} className="mt-8 space-y-5">

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-4 text-black outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#C9A227] py-4 font-bold text-white transition hover:bg-[#A67C00] disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        <p className="mt-8 text-center text-slate-600">
          Remember your password?&nbsp;
          <Link
            href="/login"
            className="font-semibold text-[#C9A227] hover:underline"
          >
            Back to Login
          </Link>
        </p>

      </div>
    </main>
  );
}