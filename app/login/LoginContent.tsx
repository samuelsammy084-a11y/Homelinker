"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Role =
  | "home_seeker"
  | "property_owner"
  | "estate_agent";

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // Redirect user according to their HomeLinker role
  // --------------------------------------------------

  async function redirectByRole(
    userId: string,
    requestedNext?: string
  ) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("HomeLinker role lookup error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      router.replace("/dashboard");
      return;
    }

    const role = profile?.role as Role | null;

    // Only allow safe internal paths
    const safeNext =
      requestedNext &&
      requestedNext.startsWith("/") &&
      !requestedNext.startsWith("//")
        ? requestedNext
        : null;

    // If another page requested a specific destination
    if (safeNext && safeNext !== "/dashboard") {
      router.replace(safeNext);
      return;
    }

    // Otherwise redirect according to role
    switch (role) {
      case "home_seeker":
        router.replace("/properties");
        break;

      case "property_owner":
        router.replace("/dashboard");
        break;

      case "estate_agent":
        router.replace("/dashboard");
        break;

      default:
        router.replace("/properties");
        break;
    }
  }

  // --------------------------------------------------
  // Complete Google OAuth login
  // --------------------------------------------------

  useEffect(() => {
    /*
     * IMPORTANT:
     * searchParams.get() returns string | null.
     *
     * We convert it into a guaranteed string here.
     */
    const oauthCode = String(
      searchParams.get("code") ?? ""
    );

    if (!oauthCode) {
      return;
    }

    const nextParam = String(
      searchParams.get("next") ?? "/dashboard"
    );

    async function completeOAuthLogin() {
      setLoading(true);

      try {
        const { data, error } =
          await supabase.auth.exchangeCodeForSession(
            oauthCode
          );

        if (error) {
          console.error(
            "HomeLinker Google OAuth error:",
            error
          );

          alert(error.message);
          return;
        }

        if (!data.user) {
          alert(
            "Google login completed, but your account could not be found."
          );
          return;
        }

        await redirectByRole(
          data.user.id,
          nextParam
        );
      } catch (error) {
        console.error(
          "HomeLinker OAuth completion error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Unable to complete Google login."
        );
      } finally {
        setLoading(false);
      }
    }

    void completeOAuthLogin();
  }, [searchParams]);

  // --------------------------------------------------
  // Google login
  // --------------------------------------------------

  async function handleGoogleLogin() {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const next = "/dashboard";

      const redirectTo =
        process.env.NODE_ENV === "development"
          ? `http://localhost:3000/auth/callback?next=${encodeURIComponent(
              next
            )}`
          : `https://homelinker.co.za/auth/callback?next=${encodeURIComponent(
              next
            )}`;

      const { error } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo,
          },
        });

      if (error) {
        console.error(
          "HomeLinker Google login error:",
          error
        );

        alert(error.message);
        setLoading(false);
      }
    } catch (error) {
      console.error(
        "HomeLinker Google login exception:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to start Google login."
      );

      setLoading(false);
    }
  }

  // --------------------------------------------------
  // Email/password login
  // --------------------------------------------------

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) {
      return;
    }

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      alert("Please enter your email address.");
      return;
    }

    if (!password) {
      alert("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (error) {
        console.error(
          "HomeLinker login error:",
          error
        );

        alert(error.message);
        return;
      }

      if (!data.user) {
        alert(
          "Login succeeded, but your account could not be found."
        );
        return;
      }

      await redirectByRole(
        data.user.id,
        "/dashboard"
      );
    } catch (error) {
      console.error(
        "HomeLinker login exception:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while signing in."
      );
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // Page
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#F8F6F1] px-4 py-12">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full rounded-[32px] border border-[#F0E7CF] bg-white p-8 shadow-[0_20px_70px_-30px_rgba(0,0,0,0.25)]">

          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/images/logo/logo.png"
              alt="HomeLinker Logo"
              width={70}
              height={70}
              priority
            />
          </div>

          {/* Heading */}
          <h1 className="mt-5 text-center text-4xl font-bold text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-3 text-center text-slate-600">
            Sign in to your HomeLinker account.
          </p>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#C9A227] py-4 font-bold text-white transition-all duration-300 hover:bg-[#A67C00] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <Image
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="h-5 w-5"
                unoptimized
              />
            </div>

            {loading
              ? "Signing In..."
              : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300" />

            <span className="px-4 text-sm font-medium text-gray-500">
              OR
            </span>

            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* Login form */}
          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 p-4 text-black outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 p-4 text-black outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                required
              />
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-[#C9A227] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign in */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-4 font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>
          </form>

          {/* Register */}
          <p className="mt-8 text-center text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#C9A227] hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}