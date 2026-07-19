"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Welcome back!");

    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] flex items-center justify-center px-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-4xl font-bold text-center text-slate-900">
          Welcome Back
        </h1>

        <p className="text-center text-slate-600 mt-3">
          Sign in to your HomeLinker account.
        </p>

        <form onSubmit={handleLogin} className="space-y-5 mt-8">

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border rounded-xl p-4 text-black"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-xl p-4 text-black"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="w-full bg-[#C9A227] text-white py-4 rounded-xl font-bold hover:bg-[#A67C00]"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <p className="text-center mt-8 text-slate-600">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-[#C9A227] font-semibold"
          >
            Register
          </Link>
        </p>

      </div>
    </main>
  );
}