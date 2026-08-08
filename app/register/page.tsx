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

  // --------------------------------------------------
  // GET THE CORRECT PAGE FOR THE USER'S ROLE
  // --------------------------------------------------

  function getRoleDestination(userRole: Role): string {
    switch (userRole) {
      case "home_seeker":
        return "/properties";

      case "property_owner":
        return "/dashboard";

      case "estate_agent":
        return "/dashboard";

      default:
        return "/properties";
    }
  }

  // --------------------------------------------------
  // REDIRECT USER AFTER LOGIN / REGISTRATION
  // --------------------------------------------------

  async function redirectUser(
    userId: string,
    fallbackRole?: Role
  ) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("HomeLinker profile lookup error:", error);

      // If the profile lookup fails, use the role selected
      // during registration instead of sending everyone
      // to the dashboard.
      if (fallbackRole) {
        router.replace(getRoleDestination(fallbackRole));
      } else {
        router.replace("/properties");
      }

      return;
    }

    const userRole = profile?.role as Role | null;

    const finalRole = userRole ?? fallbackRole ?? "home_seeker";

    router.replace(getRoleDestination(finalRole));
  }

  // --------------------------------------------------
  // GOOGLE SIGN UP / LOGIN
  // --------------------------------------------------

  async function handleGoogleLogin() {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      /*
       * Google users will return through /auth/callback.
       *
       * We use /properties as the default destination
       * because a new Google user is treated as a home
       * seeker until their profile role says otherwise.
       */
      const redirectTo =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/auth/callback?next=/properties"
          : "https://homelinker.co.za/auth/callback?next=/properties";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error(
          "HomeLinker Google registration error:",
          error
        );

        alert(error.message);
        setLoading(false);
      }
    } catch (error) {
      console.error(
        "HomeLinker Google registration exception:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to continue with Google."
      );

      setLoading(false);
    }
  }

  // --------------------------------------------------
  // EMAIL / PASSWORD REGISTRATION
  // --------------------------------------------------

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (loading) {
      return;
    }

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      alert("Please enter your full name.");
      return;
    }

    if (!cleanEmail) {
      alert("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      /*
       * The Supabase profile trigger should create the
       * matching profile automatically.
       */

      const emailRedirectTo =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/auth/callback?next=/properties"
          : "https://homelinker.co.za/auth/callback?next=/properties";

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo,

          data: {
            full_name: cleanName,
            phone: cleanPhone,
            role,
          },
        },
      });

      // ------------------------------------------------
      // REGISTRATION ERROR
      // ------------------------------------------------

      if (error) {
        console.error(
          "HomeLinker registration error:",
          error
        );

        /*
         * Make "already registered" easier for the user.
         */
        if (
          error.message
            .toLowerCase()
            .includes("already registered")
        ) {
          alert(
            "This email address is already registered.\n\nPlease sign in instead."
          );

          router.replace("/login");
          return;
        }

        alert(error.message);
        return;
      }

      // ------------------------------------------------
      // ACCOUNT CREATED + SESSION EXISTS
      // ------------------------------------------------
      //
      // This is the ideal situation.
      //
      // The user is automatically logged in and we send
      // them to the correct area based on their role.
      //

      if (data.user && data.session) {
        alert(
          "✅ Account created successfully!\n\nWelcome to HomeLinker!"
        );

        await redirectUser(data.user.id, role);
        return;
      }

      // ------------------------------------------------
      // ACCOUNT CREATED BUT EMAIL CONFIRMATION REQUIRED
      // ------------------------------------------------

      if (data.user && !data.session) {
        alert(
          "✅ Account created successfully!\n\n" +
            "Please verify your email address before signing in."
        );

        router.replace("/login");
        return;
      }

      // ------------------------------------------------
      // FALLBACK
      // ------------------------------------------------

      alert(
        "Your account was created successfully. Please sign in."
      );

      router.replace("/login");
    } catch (error) {
      console.error(
        "HomeLinker registration exception:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating your account."
      );
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#F8F6F1] px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-[32px] border border-[#F0E7CF] bg-white p-6 shadow-[0_20px_70px_-30px_rgba(0,0,0,0.25)] sm:p-10">
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
          <h1 className="mt-4 text-center text-4xl font-bold text-slate-900">
            Create Your Account
          </h1>

          <p className="mt-3 text-center text-slate-600">
            Join HomeLinker and tell us how you plan to use
            the platform.
          </p>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#C9A227] py-4 font-bold text-white transition hover:bg-[#A67C00] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
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
              ? "Please wait..."
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

          {/* Registration Form */}
          <form
            onSubmit={handleRegister}
            className="space-y-6"
          >
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                placeholder="e.g. Samuel Ndlovu"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
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
                onChange={(e) =>
                  setEmail(e.target.value)
                }
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
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 p-4 text-black outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                How will you use HomeLinker?
              </label>

              <div className="grid gap-3">
                {/* Home Seeker */}
                <button
                  type="button"
                  onClick={() =>
                    setRole("home_seeker")
                  }
                  className={`rounded-2xl border p-5 text-left transition ${
                    role === "home_seeker"
                      ? "border-[#C9A227] bg-[#FFF9E8] ring-2 ring-[#C9A227]/20"
                      : "border-slate-300 bg-white hover:border-[#C9A227]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">
                      🔎
                    </span>

                    <div>
                      <p className="font-bold text-black">
                        I&apos;m looking for a home
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        I want to find a house,
                        apartment, room, or other
                        property to rent or buy.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Property Owner */}
                <button
                  type="button"
                  onClick={() =>
                    setRole("property_owner")
                  }
                  className={`rounded-2xl border p-5 text-left transition ${
                    role === "property_owner"
                      ? "border-[#C9A227] bg-[#FFF9E8] ring-2 ring-[#C9A227]/20"
                      : "border-slate-300 bg-white hover:border-[#C9A227]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">
                      🏡
                    </span>

                    <div>
                      <p className="font-bold text-black">
                        I&apos;m listing my property
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        I own a property and want to
                        advertise it for rent or sale.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Estate Agent */}
                <button
                  type="button"
                  onClick={() =>
                    setRole("estate_agent")
                  }
                  className={`rounded-2xl border p-5 text-left transition ${
                    role === "estate_agent"
                      ? "border-[#C9A227] bg-[#FFF9E8] ring-2 ring-[#C9A227]/20"
                      : "border-slate-300 bg-white hover:border-[#C9A227]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">
                      🏢
                    </span>

                    <div>
                      <p className="font-bold text-black">
                        I&apos;m an estate agent
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        I represent properties or
                        clients as a real-estate
                        professional.
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
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 p-4 text-black outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                required
                minLength={6}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 p-4 text-black outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                required
                minLength={6}
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

          {/* Login */}
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