"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const next = searchParams.get("next") || "/dashboard";

    if (!code) return;

    async function completeOAuthLogin() {
      if (!code) {
        return;
      }

      setLoading(true);
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      setLoading(false);

      if (error) {
        alert(error.message);
        return;
      }

      router.replace(next);
    }

    void completeOAuthLogin();
  }, [router, searchParams]);

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/auth/callback?next=/dashboard"
            : "https://homelinker.co.za/auth/callback?next=/dashboard",
      },
    });

    if (error) {
      alert(error.message);
    }
  }

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

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-slate-900">Welcome Back</h1>
        <p className="mt-3 text-center text-slate-600">Sign in to your HomeLinker account.</p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-8 w-full flex items-center justify-center gap-3 rounded-xl bg-[#C9A227] py-4 text-white font-bold transition-all duration-300 hover:bg-[#A67C00] hover:shadow-xl"
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
          <span className="px-4 text-sm font-medium text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-4 text-black outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-4 text-black outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
            required
          />

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm font-semibold text-[#C9A227] hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 py-4 font-bold text-white transition hover:bg-black disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-[#C9A227] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
