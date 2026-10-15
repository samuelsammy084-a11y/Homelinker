"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Home,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type VerificationStatus =
  | "unverified"
  | "pending"
  | "in_progress"
  | "approved"
  | "verified"
  | "declined"
  | "expired"
  | "cancelled";

type IdentityVerification = {
  status: string;
  created_at: string;
  updated_at: string;
};

export default function VerifyPage() {
  const router = useRouter();

  const [status, setStatus] =
    useState<VerificationStatus>("unverified");

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [checking, setChecking] = useState(false);

  const loadVerification = useCallback(
    async (showMessage = false) => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace("/login");
          return;
        }

        const { data: profile, error: profileError } =
          await supabase
            .from("profiles")
            .select(
              "is_verified, verification_status"
            )
            .eq("id", user.id)
            .maybeSingle();

        if (profileError) {
          console.error(
            "Profile verification error:",
            profileError
          );

          if (showMessage) {
            toast.error(
              "Could not refresh your verification status."
            );
          }

          return;
        }

        if (
          profile?.is_verified === true &&
          profile?.verification_status === "verified"
        ) {
          setStatus("verified");

          if (showMessage) {
            toast.success(
              "Your identity is verified."
            );
          }

          return;
        }

        const {
          data: verification,
          error: verificationError,
        } = await supabase
          .from("identity_verifications")
          .select(
            "status, created_at, updated_at"
          )
          .eq("user_id", user.id)
          .eq("provider", "didit")
          .order("created_at", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle<IdentityVerification>();

        if (verificationError) {
          console.error(
            "Identity verification error:",
            verificationError
          );
        }

        if (verification?.status) {
          const latestStatus =
            verification.status as VerificationStatus;

          if (latestStatus === "approved") {
            setStatus("verified");
          } else {
            setStatus(latestStatus);
          }

          if (showMessage) {
            if (latestStatus === "approved") {
              toast.success(
                "Your identity is verified."
              );
            } else if (
              latestStatus === "pending" ||
              latestStatus === "in_progress"
            ) {
              toast.info(
                "Your verification is still in progress."
              );
            } else {
              toast.info(
                "Verification status updated."
              );
            }
          }

          return;
        }

        const profileStatus =
          profile?.verification_status;

        if (profileStatus === "pending") {
          setStatus("pending");
        } else if (
          profileStatus === "declined" ||
          profileStatus === "rejected"
        ) {
          setStatus("declined");
        } else if (
          profileStatus === "expired"
        ) {
          setStatus("expired");
        } else {
          setStatus("unverified");
        }

        if (showMessage) {
          toast.info(
            "No completed verification found yet."
          );
        }
      } catch (error) {
        console.error(
          "Verification loading error:",
          error
        );

        if (showMessage) {
          toast.error(
            "Something went wrong while checking verification."
          );
        }
      }
    },
    [router]
  );

  useEffect(() => {
    async function initialise() {
      setLoading(true);
      await loadVerification();
      setLoading(false);
    }

    void initialise();
  }, [loadVerification]);

  async function startVerification() {
    if (starting) return;

    setStarting(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (
        sessionError ||
        !session?.access_token
      ) {
        toast.error(
          "Please sign in again before starting verification."
        );

        router.push("/login");
        return;
      }

      const response = await fetch(
        "/api/verification/start",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = (await response.json()) as {
        success?: boolean;
        verificationUrl?: string;
        error?: string;
        code?: string;
      };

      if (!response.ok) {
        if (data.code === "ALREADY_VERIFIED") {
          await loadVerification();

          toast.success(
            "Your identity is already verified."
          );

          return;
        }

        throw new Error(
          data.error ||
            "Could not start identity verification."
        );
      }

      if (!data.verificationUrl) {
        throw new Error(
          "The verification provider did not return a verification link."
        );
      }

      let verificationUrl: URL;

      try {
        verificationUrl = new URL(
          data.verificationUrl
        );
      } catch {
        throw new Error(
          "Invalid verification link received."
        );
      }

      if (
        verificationUrl.protocol !== "https:" ||
        verificationUrl.hostname !==
          "verify.didit.me"
      ) {
        throw new Error(
          "HomeLinker blocked an invalid verification link."
        );
      }

      window.location.assign(
        verificationUrl.toString()
      );
    } catch (error) {
      console.error(
        "Start verification error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not start verification."
      );
    } finally {
      setStarting(false);
    }
  }

  async function refreshStatus() {
    if (checking) return;

    setChecking(true);

    try {
      await loadVerification(true);
    } finally {
      setChecking(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-4 py-20">
        <div className="mx-auto max-w-2xl rounded-[32px] border border-[#EFE7D4] bg-white p-10 text-center shadow-xl">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#C9A227]/20 border-t-[#C9A227]" />

          <h1 className="mt-6 text-2xl font-black text-[#1B1B1B]">
            Checking your account...
          </h1>

          <p className="mt-2 text-slate-500">
            We&apos;re checking your identity
            verification status.
          </p>
        </div>
      </main>
    );
  }

  const isPending =
    status === "pending" ||
    status === "in_progress";

  const needsRetry =
    status === "declined" ||
    status === "expired" ||
    status === "cancelled";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FCFAF5_0%,#F8F6F1_100%)] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/profile"
          className="mb-6 inline-flex items-center gap-2 font-semibold text-slate-600 transition hover:text-[#C9A227]"
        >
          <ArrowLeft size={18} />
          Back to Profile
        </Link>

        <section className="overflow-hidden rounded-[32px] bg-[#111111] p-6 text-white shadow-xl sm:p-10">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#C9A227]/15 text-[#C9A227]">
              <ShieldCheck size={28} />
            </div>

            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                HomeLinker Identity Verification
              </p>

              <h1 className="text-3xl font-black sm:text-4xl">
                Real people. Safer property
                listings.
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                Property owners and estate agents
                must verify their identity before
                posting new properties on
                HomeLinker.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-start gap-3">
              <Home
                size={21}
                className="mt-0.5 shrink-0 text-[#C9A227]"
              />

              <p className="text-sm leading-6 text-slate-300">
                <strong className="text-white">
                  Already have listings?
                </strong>{" "}
                Your existing property listings
                remain active. Verification is
                required before you can publish new
                properties.
              </p>
            </div>
          </div>
        </section>

        {status === "verified" && (
          <section className="mt-8 rounded-[32px] border border-emerald-200 bg-white p-8 text-center shadow-xl sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2
                size={42}
                className="text-emerald-600"
              />
            </div>

            <h2 className="mt-6 text-3xl font-black text-[#1B1B1B]">
              Identity verified
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
              Your HomeLinker identity verification
              is complete. You can now post new
              property listings.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/post-listing"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C9A227] px-7 py-4 font-bold text-black transition hover:bg-[#D8B43C]"
              >
                Post a Property
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/profile"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-7 py-4 font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Back to Profile
              </Link>
            </div>
          </section>
        )}

        {isPending && (
          <section className="mt-8 rounded-[32px] border border-amber-200 bg-white p-8 text-center shadow-xl sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
              <Clock3
                size={40}
                className="text-amber-600"
              />
            </div>

            <h2 className="mt-6 text-3xl font-black text-[#1B1B1B]">
              Verification in progress
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
              Your identity verification has been
              started. Once the verification
              provider completes the checks,
              HomeLinker will update your account
              automatically.
            </p>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              You won&apos;t be able to publish a
              new property until verification is
              approved. Your existing listings
              remain active.
            </p>

            <button
              type="button"
              onClick={refreshStatus}
              disabled={checking}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C9A227] px-7 py-3.5 font-bold text-[#9A791D] transition hover:bg-[#FFF9E8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={18}
                className={
                  checking ? "animate-spin" : ""
                }
              />

              {checking
                ? "Checking..."
                : "Check verification status"}
            </button>
          </section>
        )}

        {needsRetry && (
          <section className="mt-8 rounded-[32px] border border-red-200 bg-white p-8 text-center shadow-xl sm:p-10">
            <ShieldCheck
              size={58}
              className="mx-auto text-red-500"
            />

            <h2 className="mt-5 text-3xl font-black text-[#1B1B1B]">
              Verification needs attention
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
              Your previous identity verification
              was not completed or approved. You
              can start a new secure verification
              attempt.
            </p>

            <button
              type="button"
              onClick={startVerification}
              disabled={starting}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C9A227] px-8 py-4 font-bold text-black transition hover:bg-[#D8B43C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {starting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                  Starting verification...
                </>
              ) : (
                <>
                  <RefreshCw size={19} />
                  Try Verification Again
                </>
              )}
            </button>
          </section>
        )}

        {status === "unverified" && (
          <>
            <section className="mt-8 rounded-[32px] border border-[#F0E7CF] bg-white p-6 shadow-xl sm:p-10">
              <h2 className="text-2xl font-black text-[#1B1B1B]">
                Verify your identity securely
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                HomeLinker uses a dedicated identity
                verification provider to perform the
                verification process. You&apos;ll
                leave HomeLinker temporarily to
                complete the secure checks.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <InfoCard
                  icon={<UserCheck size={24} />}
                  title="Identity check"
                  text="Confirm that you are a real person."
                />

                <InfoCard
                  icon={<ShieldCheck size={24} />}
                  title="Safer marketplace"
                  text="Helps reduce fake advertiser accounts."
                />

                <InfoCard
                  icon={<LockKeyhole size={24} />}
                  title="Secure process"
                  text="Verification is completed through our identity provider."
                />
              </div>

              <div className="mt-8 rounded-2xl bg-[#F8F6F1] p-5">
                <div className="flex items-start gap-3">
                  <LockKeyhole
                    size={21}
                    className="mt-0.5 shrink-0 text-[#C9A227]"
                  />

                  <p className="text-sm leading-6 text-slate-600">
                    HomeLinker does not ask you to
                    upload your identity document or
                    selfie directly to this website.
                    The identity verification process
                    is handled by our verification
                    provider, and HomeLinker receives
                    the verification result needed to
                    update your account.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={startVerification}
                disabled={starting}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#C9A227] px-6 py-4 font-bold text-black transition hover:bg-[#D8B43C] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {starting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    Preparing secure verification...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    Verify My Identity
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                By continuing, you&apos;ll be
                redirected to our identity
                verification provider to complete
                the required verification checks.
              </p>
            </section>

            <section className="mt-5 rounded-2xl border border-[#E8DFC9] bg-[#FFFDF8] p-5">
              <p className="text-sm leading-6 text-slate-600">
                <strong className="text-[#1B1B1B]">
                  Looking for a home?
                </strong>{" "}
                Identity verification is not required
                to browse properties, save favourites
                or contact advertisers. It is required
                when you want to advertise a new
                property.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#EEE7D7] bg-[#FFFDF8] p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C9A227]/10 text-[#C9A227]">
        {icon}
      </div>

      <h3 className="mt-4 font-black text-[#1B1B1B]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}