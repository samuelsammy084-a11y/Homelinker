"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Account created! Check your email to verify your account.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Create Your Account
          </h1>

          <p className="text-slate-600 mt-3">
            Join HomeLinker and start finding or listing properties.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border p-4 rounded-xl text-black"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-4 rounded-xl text-black"
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-4 rounded-xl text-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-4 rounded-xl text-black"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-4 rounded-xl text-black"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A227] text-white py-4 rounded-xl font-bold hover:bg-[#A67C00]"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="text-center mt-8 text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#C9A227] font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>

      </div>
    </main>
  );
}