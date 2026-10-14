"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();

  const sessionId =
    searchParams.get("session_id");

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  const [message, setMessage] = useState(
    "Confirming your payment..."
  );

  useEffect(() => {
    let cancelled = false;
    let redirectTimer:
      | ReturnType<typeof setTimeout>
      | undefined;

    async function activateListing() {
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
        /*
         * Get the currently authenticated
         * HomeLinker user's Supabase session.
         */
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

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
            "Your payment was received, but you need to sign in again before we can activate your listing."
          );
        }

        /*
         * The server will:
         *
         * 1. Authenticate this user.
         * 2. Retrieve the Checkout Session
         *    directly from Stripe.
         * 3. Confirm Stripe says it is paid.
         * 4. Verify the Stripe session belongs
         *    to this user.
         * 5. Verify this user owns the property.
         * 6. Activate the paid listing.
         */
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

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to activate your listing."
          );
        }

        if (cancelled) {
          return;
        }

        sessionStorage.removeItem(
          "propertyId"
        );

        setStatus("success");

        setMessage(
          data.alreadyActivated
            ? "Your payment was already confirmed and your property is live."
            : "Your payment was successful and your property is now live."
        );

        redirectTimer = setTimeout(() => {
          window.location.href =
            "/dashboard";
        }, 1500);
      } catch (error) {
        console.error(
          "Payment activation error:",
          error
        );

        if (cancelled) {
          return;
        }

        setStatus("error");

        setMessage(
          error instanceof Error
            ? error.message
            : "Payment was successful, but we could not activate your listing."
        );
      }
    }

    void activateListing();

    return () => {
      cancelled = true;

      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [sessionId]);

  return (
    <div className="w-full max-w-lg rounded-[32px] bg-white p-10 text-center shadow-2xl">
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

          <p className="mt-4 text-[#666666]">
            Please wait while we confirm your
            payment and publish your property.
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle
              size={48}
              className="text-green-600"
            />
          </div>

          <h1 className="mt-6 text-3xl font-black text-[#111111]">
            Payment Successful!
          </h1>

          <p className="mt-4 text-[#666666]">
            {message}
          </p>

          <p className="mt-6 text-sm font-semibold text-[#C9A227]">
            Taking you to your dashboard...
          </p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">
            ❌
          </div>

          <h1 className="mt-6 text-3xl font-black text-[#111111]">
            We couldn&apos;t activate your listing
          </h1>

          <p className="mt-4 text-[#666666]">
            {message}
          </p>

          <p className="mt-4 text-sm text-[#777777]">
            If your payment was completed, do not
            pay again. You can return to your
            dashboard and contact HomeLinker if
            the listing is still not active.
          </p>

          <a
            href="/dashboard"
            className="mt-8 inline-flex rounded-2xl bg-[#C9A227] px-8 py-4 font-bold text-white transition hover:bg-[#A67C00]"
          >
            Go to Dashboard
          </a>
        </>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F6F1] px-6">
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