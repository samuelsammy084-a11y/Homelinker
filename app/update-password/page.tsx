"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Password updated successfully!");

    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">

        <h1 className="text-4xl font-bold text-center text-slate-900">
          Create New Password
        </h1>

        <p className="mt-3 text-center text-slate-600">
          Enter your new password below.
        </p>

        <form onSubmit={handleUpdate} className="mt-8 space-y-5">

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-4 text-black outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
            required
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-4 text-black outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#C9A227] py-4 font-bold text-white hover:bg-[#A67C00]"
          >
            {loading ? "Updating Password..." : "Update Password"}
          </button>

        </form>

      </div>
    </main>
  );
}