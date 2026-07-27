"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://homelinker.co.za",
      },
    });

    if (error) {
      alert(error.message);
    }
  }

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
        emailRedirectTo:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://homelinker.co.za",
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "✅ Account created successfully!\n\nPlease verify your email before logging in."
    );

    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-2xl">

        <h1 className="text-4xl font-bold text-center text-slate-900">
          Create Your Account
        </h1>

        <p className="mt-3 text-center text-slate-600">
          Join HomeLinker and start finding or listing properties.
        </p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-8 w-full flex items-center justify-center gap-3 rounded-xl bg-[#C9A227] py-4 text-white font-bold hover:bg-[#A67C00]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="h-5 w-5"
            />
          </div>

          Continue with Google
        </button>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border p-4 text-black"
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border p-4 text-black"
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border p-4 text-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border p-4 text-black"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border p-4 text-black"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 py-4 font-bold text-white hover:bg-black"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="mt-8 text-center text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#C9A227] hover:underline"
          >
            Sign In
          </Link>
        </p>

      </div>
    </main>
  );
}