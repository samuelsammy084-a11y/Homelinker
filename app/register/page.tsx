"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Role = "home_seeker" | "property_owner" | "estate_agent";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("home_seeker");
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/auth/callback?next=/dashboard"
            : "https://homelinker.co.za/auth/callback?next=/dashboard",
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      alert(error.message);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      /*
       * 1. Create the Supabase Auth account.
       */
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo:
            process.env.NODE_ENV === "development"
              ? "http://localhost:3000/auth/callback?next=/dashboard"
              : "https://homelinker.co.za/auth/callback?next=/dashboard",

          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
            role,
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      /*
       * 2. Supabase normally returns the user even when
       * email verification is required.
       */
      const user = data.user;

      if (!user) {
        alert(
          "Your account could not be created. Please try again."
        );
        return;
      }

      /*
       * 3. Create the user's HomeLinker profile.
       */
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            full_name: fullName.trim(),
            phone: phone.trim() || null,
            role,
          },
          {
            onConflict: "id",
          }
        );

      if (profileError) {
        console.error(
          "HomeLinker profile creation error:",
          profileError
        );

        alert(
          `Your account was created, but your HomeLinker profile could not be created.\n\n${profileError.message}`
        );

        return;
      }

      alert(
        "✅ Account created successfully!\n\nPlease verify your email before logging in."
      );

      router.push("/login");
    } catch (error) {
      console.error("HomeLinker registration error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong creating your account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10">

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

          <h1 className="mt-4 text-center text-4xl font-bold text-slate-900">
            Create Your Account
          </h1>

          <p className="mt-3 text-center text-slate-600">
            Join HomeLinker and tell us how you plan to use the platform.
          </p>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#C9A227] py-4 font-bold text-white transition hover:bg-[#A67C00]"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <Image
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                fill
                className="h-5 w-5 p-1"
                unoptimized
              />
            </div>

            Continue with Google
          </button>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-4 text-sm text-gray-500">
              OR
            </span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          <form onSubmit={handleRegister} className="space-y-6">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                placeholder="e.g. Samuel Ndlovu"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-4 text-black outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-4 text-black outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Phone Number
              </label>

              <input
                type="tel"
                placeholder="e.g. 0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-4 text-black outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                How will you use HomeLinker?
              </label>

              <div className="grid gap-3">

                {/* Home seeker */}
                <button
                  type="button"
                  onClick={() => setRole("home_seeker")}
                  className={`rounded-2xl border p-5 text-left transition ${
                    role === "home_seeker"
                      ? "border-[#C9A227] bg-[#FFF9E8] ring-2 ring-[#C9A227]/20"
                      : "border-slate-300 bg-white hover:border-[#C9A227]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">🔎</span>

                    <div>
                      <p className="font-bold text-black">
                        I&apos;m looking for a home
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        I want to find a house, apartment, room,
                        or other property to rent or buy.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Property owner */}
                <button
                  type="button"
                  onClick={() => setRole("property_owner")}
                  className={`rounded-2xl border p-5 text-left transition ${
                    role === "property_owner"
                      ? "border-[#C9A227] bg-[#FFF9E8] ring-2 ring-[#C9A227]/20"
                      : "border-slate-300 bg-white hover:border-[#C9A227]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">🏡</span>

                    <div>
                      <p className="font-bold text-black">
                        I&apos;m listing my property
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        I own a property and want to advertise it
                        for rent or sale.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Estate agent */}
                <button
                  type="button"
                  onClick={() => setRole("estate_agent")}
                  className={`rounded-2xl border p-5 text-left transition ${
                    role === "estate_agent"
                      ? "border-[#C9A227] bg-[#FFF9E8] ring-2 ring-[#C9A227]/20"
                      : "border-slate-300 bg-white hover:border-[#C9A227]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">🏢</span>

                    <div>
                      <p className="font-bold text-black">
                        I&apos;m an estate agent
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        I represent properties or clients as a
                        real-estate professional.
                      </p>
                    </div>
                  </div>
                </button>

              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-4 text-black outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                required
              />
            </div>

            {/* Confirm password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-4 text-black outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-4 font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Account..."
                : "Create HomeLinker Account"}
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
      </div>
    </main>
  );
}