import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    /*
     * Read and validate server environment variables
     * inside the request handler.
     *
     * This prevents Next.js from crashing during
     * build-time module evaluation.
     */
    const stripeSecretKey =
      process.env.STRIPE_SECRET_KEY;

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseServiceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!stripeSecretKey) {
      console.error(
        "Missing STRIPE_SECRET_KEY."
      );

      return NextResponse.json(
        {
          error:
            "Payment service is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      !supabaseUrl ||
      !supabaseServiceRoleKey
    ) {
      console.error(
        "Missing Supabase server environment variables."
      );

      return NextResponse.json(
        {
          error:
            "Database service is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Server-only clients.
     *
     * Never expose SUPABASE_SERVICE_ROLE_KEY
     * to client components.
     */
    const stripe = new Stripe(
      stripeSecretKey
    );

    const supabaseAdmin =
      createClient(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      );

    const body = await req.json();

    const sessionId =
      typeof body?.sessionId === "string"
        ? body.sessionId.trim()
        : "";

    if (!sessionId) {
      return NextResponse.json(
        {
          error:
            "Payment session ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Ask Stripe directly for the session.
     * Do not trust payment information sent
     * from the browser.
     */
    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId
      );

    if (
      session.payment_status !== "paid"
    ) {
      return NextResponse.json(
        {
          error:
            "Payment has not been confirmed.",
        },
        {
          status: 400,
        }
      );
    }

    const propertyId =
      session.metadata?.propertyId;

    const plan =
      session.metadata?.plan;

    if (!propertyId || !plan) {
      return NextResponse.json(
        {
          error:
            "Payment information is incomplete.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      plan !== "premium" &&
      plan !== "pro"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid payment plan.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Confirm the property actually exists.
     */
    const {
      data: property,
      error: propertyError,
    } = await supabaseAdmin
      .from("properties")
      .select("id, status, plan")
      .eq("id", propertyId)
      .maybeSingle();

    if (propertyError) {
      console.error(
        "Property lookup error:",
        propertyError
      );

      return NextResponse.json(
        {
          error:
            "Unable to find the property.",
        },
        {
          status: 500,
        }
      );
    }

    if (!property) {
      return NextResponse.json(
        {
          error:
            "The property could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Payment is confirmed by Stripe,
     * so activate the paid listing.
     */
    const { error: updateError } =
      await supabaseAdmin
        .from("properties")
        .update({
          status: "active",
          plan,
          payment_status: "paid",
          stripe_session_id:
            session.id,
        })
        .eq("id", propertyId);

    if (updateError) {
      console.error(
        "Property activation error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Payment was confirmed, but the property could not be activated.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      propertyId,
      plan,
    });
  } catch (error) {
    console.error(
      "Paid listing activation error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to confirm payment and activate listing.",
      },
      {
        status: 500,
      }
    );
  }
}