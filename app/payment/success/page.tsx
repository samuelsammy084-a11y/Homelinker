"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Crown,
  Home,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type PaymentStatus =
  | "loading"
  | "success"
  | "error";

type ActivatedPlan =
  | "premium"
  | "pro"
  | null;

function PaymentSuccessContent() {
  const searchParams = useSearchParams();

  const sessionId =
    searchParams.get("session_id");

  const [status, setStatus] =
    useState<PaymentStatus>("loading");

  const [plan, setPlan] =
    useState<ActivatedPlan>(null);

  const [message, setMessage] = useState(
    "Confirming your payment..."
  );

  const [expiresAt, setExpiresAt] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    let redirectTimer:
      | ReturnType<typeof setTimeout>
      | undefined;

    async function confirmPayment() {
      if (!sessionId) {
        if (!cancelled) {
          setStatus("error");

          setMessage(
            "Payment session could not be found."
          );
        }

        return;
      }

      try {
        // ============================================
        // GET CURRENT HOME­LINKER SESSION
        // ============================================

        const {
          data: { session },
          error: sessionError,
        } =
          await supabase.auth.getSession();

        if (sessionError) {
          console.error(
            "Payment success session error:",
            sessionError
          );

          throw new Error(
            "Unable to verify your login. Please sign in again."
          );
        }

        if (!session?.access_token) {
          throw new Error(
            "Your payment may have been received, but you need to sign in again so HomeLinker can confirm your plan."
          );
        }

        // ============================================
        // RECONCILE PAYMENT WITH SERVER
        // ============================================
        //
        // The server retrieves the Checkout Session
        // directly from Stripe.
        //
        // It confirms:
        // - Stripe says the payment is paid
        // - The payment belongs to this user
        // - The price is correct
        // - The currency is ZAR
        // - The plan metadata is valid
        // - The property belongs to the user
        //
        // The Stripe webhook remains the primary
        // payment fulfillment path.
        //
        // This endpoint also acts as a recovery path
        // if the webhook has not completed yet.

        const response = await fetch(
          "/api/activate-paid-listing",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${session.access_token}`,
            },

            body: JSON.stringify({
              sessionId,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "HomeLinker could not confirm your paid plan."
          );
        }

        if (cancelled) {
          return;
        }

        // ============================================
        // DETERMINE ACTIVATED PLAN
        // ============================================

        const activatedPlan:
          | ActivatedPlan =
          data.plan === "premium" ||
          data.plan === "pro"
            ? data.plan
            : null;

        if (!activatedPlan) {
          throw new Error(
            "Your payment was confirmed, but the activated plan could not be identified."
          );
        }

        setPlan(activatedPlan);

        if (
          typeof data.expiresAt ===
          "string"
        ) {
          setExpiresAt(data.expiresAt);
        }

        // The listing has now completed its
        // pricing/payment flow.
        sessionStorage.removeItem(
          "propertyId"
        );

        // ============================================
        // SUCCESS MESSAGE
        // ============================================

        if (
          activatedPlan === "premium"
        ) {
          setMessage(
            data.alreadyActivated
              ? "Your Premium payment was already confirmed. Your property is receiving Premium promotion."
              : "Your property is now Premium and will receive enhanced promotion for 30 days."
          );
        } else {
          setMessage(
            data.alreadyActivated
              ? "Your Pro payment was already confirmed. Your HomeLinker Pro package is active."
              : "Welcome to HomeLinker Pro. Your 30-day advertiser package is now active."
          );
        }

        setStatus("success");

        // Give the customer enough time to actually
        // read what they purchased before redirecting.
        redirectTimer = setTimeout(() => {
          window.location.href =
            "/dashboard";
        }, 4500);
      } catch (error) {
        console.error(
          "Payment confirmation error:",
          error
        );

        if (cancelled) {
          return;
        }

        setStatus("error");

        setMessage(
          error instanceof Error
            ? error.message
            : "Your payment may have succeeded, but HomeLinker could not confirm your plan."
        );
      }
    }

    void confirmPayment();

    return () => {
      cancelled = true;

      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [sessionId]);

  function formatExpiry(
    value: string
  ) {
    try {
      return new Intl.DateTimeFormat(
        "en-ZA",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      ).format(new Date(value));
    } catch {
      return null;
    }
  }

  const formattedExpiry =
    expiresAt
      ? formatExpiry(expiresAt)
      : null;

  return (
    <div className="w-full max-w-xl overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-2xl">
      {/* GOLD TOP ACCENT */}

      <div className="h-2 w-full bg-[#C9A227]" />

      <div className="p-8 text-center sm:p-10">
        {/* ==========================================
            LOADING
        ========================================== */}

        {status === "loading" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#C9A227]/10">
              <Loader2
                size={42}
                className="animate-spin text-[#C9A227]"
              />
            </div>

            <h1 className="mt-6 text-3xl font-black text-[#111111]">
              Confirming Payment
            </h1>

            <p className="mx-auto mt-4 max-w-md leading-7 text-[#666666]">
              Please wait while HomeLinker
              securely confirms your payment
              with Stripe and activates your
              plan.
            </p>

            <div className="mx-auto mt-7 flex max-w-sm items-center justify-center gap-2 rounded-2xl bg-[#F8F6F1] px-4 py-3 text-sm font-semibold text-[#555555]">
              <ShieldCheck
                size={18}
                className="text-[#C9A227]"
              />

              Secure payment confirmation
            </div>
          </>
        )}

        {/* ==========================================
            SUCCESS
        ========================================== */}

        {status === "success" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle
                size={48}
                className="text-green-600"
              />
            </div>

            {plan === "premium" && (
              <>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C9A227]/10 px-4 py-2 text-sm font-black uppercase tracking-wide text-[#A67C00]">
                  <Crown size={16} />
                  Premium
                </div>

                <h1 className="mt-4 text-3xl font-black text-[#111111] sm:text-4xl">
                  Premium Activated!
                </h1>

                <p className="mx-auto mt-4 max-w-md leading-7 text-[#666666]">
                  {message}
                </p>

                <div className="mt-7 rounded-3xl bg-[#111111] p-6 text-left text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C9A227] text-black">
                      <Home size={22} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
                        Premium Property
                      </p>

                      <p className="font-bold">
                        30 days of enhanced
                        promotion
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 text-sm text-white/75">
                    <p>
                      ✓ Higher visibility in
                      HomeLinker search
                    </p>

                    <p>
                      ✓ Featured placement
                      eligibility
                    </p>

                    <p>
                      ✓ Premium promotion
                    </p>
                  </div>

                  {formattedExpiry && (
                    <div className="mt-5 border-t border-white/10 pt-4 text-sm">
                      <span className="text-white/60">
                        Promotion active until
                      </span>

                      <p className="mt-1 font-bold text-[#C9A227]">
                        {formattedExpiry}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {plan === "pro" && (
              <>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C9A227]/10 px-4 py-2 text-sm font-black uppercase tracking-wide text-[#A67C00]">
                  <Crown size={16} />
                  HomeLinker Pro
                </div>

                <h1 className="mt-4 text-3xl font-black text-[#111111] sm:text-4xl">
                  Welcome to Pro!
                </h1>

                <p className="mx-auto mt-4 max-w-md leading-7 text-[#666666]">
                  {message}
                </p>

                <div className="mt-7 rounded-3xl bg-[#111111] p-6 text-left text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C9A227] text-black">
                      <Crown size={22} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
                        Pro Advertiser
                      </p>

                      <p className="font-bold">
                        Your 30-day package is
                        active
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 text-sm text-white/75">
                    <p>
                      ✓ Promote up to 10 active
                      properties
                    </p>

                    <p>
                      ✓ Choose up to 3 Priority
                      Properties
                    </p>

                    <p>
                      ✓ Pro advertiser benefits
                      and enhanced visibility
                    </p>
                  </div>

                  {formattedExpiry && (
                    <div className="mt-5 border-t border-white/10 pt-4 text-sm">
                      <span className="text-white/60">
                        Pro active until
                      </span>

                      <p className="mt-1 font-bold text-[#C9A227]">
                        {formattedExpiry}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            <p className="mt-7 text-sm font-semibold text-[#C9A227]">
              Taking you to your
              dashboard...
            </p>

            <a
              href="/dashboard"
              className="mt-4 inline-flex rounded-2xl bg-[#111111] px-7 py-3.5 font-bold text-white transition hover:bg-[#222222]"
            >
              Go to Dashboard Now
            </a>
          </>
        )}

        {/* ==========================================
            ERROR
        ========================================== */}

        {status === "error" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">
              ❌
            </div>

            <h1 className="mt-6 text-3xl font-black text-[#111111]">
              We couldn&apos;t confirm your
              plan
            </h1>

            <p className="mx-auto mt-4 max-w-md leading-7 text-[#666666]">
              {message}
            </p>

            <div className="mt-6 rounded-2xl border border-[#C9A227]/20 bg-[#C9A227]/5 p-4 text-sm leading-6 text-[#555555]">
              <strong className="text-[#111111]">
                Don&apos;t pay again.
              </strong>{" "}
              If Stripe completed your
              payment, HomeLinker may already
              have received it. Check your
              dashboard first.
            </div>

            <a
              href="/dashboard"
              className="mt-8 inline-flex rounded-2xl bg-[#C9A227] px-8 py-4 font-bold text-black transition hover:bg-[#B8921F]"
            >
              Go to Dashboard
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F6F1] px-6 py-12">
      <Suspense
        fallback={
          <div className="flex items-center gap-3 text-[#666666]">
            <Loader2
              size={22}
              className="animate-spin text-[#C9A227]"
            />

            Loading...
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </main>
  );
}