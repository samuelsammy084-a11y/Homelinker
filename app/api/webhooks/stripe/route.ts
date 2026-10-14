import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const ALLOWED_PLANS = ["premium", "pro"] as const;

type AllowedPlan = (typeof ALLOWED_PLANS)[number];

export async function POST(req: Request) {
  /*
   * Read environment variables at request time.
   * Do not use fake fallback credentials.
   */
  const stripeSecretKey =
    process.env.STRIPE_SECRET_KEY;

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseServiceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (
    !stripeSecretKey ||
    !webhookSecret ||
    !supabaseUrl ||
    !supabaseServiceRoleKey
  ) {
    console.error(
      "Stripe webhook environment variables are missing."
    );

    return NextResponse.json(
      {
        error:
          "Webhook service is not configured.",
      },
      {
        status: 500,
      }
    );
  }

  /*
   * Stripe requires the raw request body when
   * validating a webhook signature.
   */
  const body = await req.text();

  const signature =
    req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {
        error:
          "Missing Stripe signature.",
      },
      {
        status: 400,
      }
    );
  }

  const stripe = new Stripe(
    stripeSecretKey
  );

  let event: Stripe.Event;

  try {
    event =
      stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Invalid webhook signature.",
      },
      {
        status: 400,
      }
    );
  }

  /*
   * Ignore Stripe events that HomeLinker does
   * not currently need.
   */
  if (
    event.type !==
    "checkout.session.completed"
  ) {
    return NextResponse.json({
      received: true,
    });
  }

  const session =
    event.data.object as Stripe.Checkout.Session;

  /*
   * A completed Checkout Session is not enough
   * by itself. Confirm Stripe reports the
   * payment as paid.
   */
  if (
    session.payment_status !== "paid"
  ) {
    return NextResponse.json({
      received: true,
    });
  }

  const metadataPropertyId =
    session.metadata?.propertyId;

  const metadataPlan =
    session.metadata?.plan;

  const metadataUserId =
    session.metadata?.userId;

  /*
   * New HomeLinker Checkout Sessions contain
   * all three metadata values.
   */
  if (
    !metadataPropertyId ||
    !metadataPlan ||
    !metadataUserId
  ) {
    console.error(
      "Stripe Checkout Session is missing required HomeLinker metadata.",
      {
        sessionId: session.id,
      }
    );

    return NextResponse.json(
      {
        error:
          "Payment metadata is incomplete.",
      },
      {
        status: 400,
      }
    );
  }

  const propertyId = Number(
    metadataPropertyId
  );

  if (
    !Number.isInteger(propertyId) ||
    propertyId <= 0
  ) {
    console.error(
      "Stripe webhook received an invalid property ID.",
      {
        sessionId: session.id,
      }
    );

    return NextResponse.json(
      {
        error:
          "Invalid property ID.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    !ALLOWED_PLANS.includes(
      metadataPlan as AllowedPlan
    )
  ) {
    console.error(
      "Stripe webhook received an invalid plan.",
      {
        sessionId: session.id,
        plan: metadataPlan,
      }
    );

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

  const plan =
    metadataPlan as AllowedPlan;

  /*
   * Checkout creation stores the authenticated
   * HomeLinker user in both metadata and
   * client_reference_id.
   */
  if (
    session.client_reference_id !==
    metadataUserId
  ) {
    console.error(
      "Stripe Checkout Session user information does not match.",
      {
        sessionId: session.id,
      }
    );

    return NextResponse.json(
      {
        error:
          "Payment user information is invalid.",
      },
      {
        status: 400,
      }
    );
  }

  /*
   * Service-role client.
   *
   * This bypasses RLS, so ownership is checked
   * explicitly before any update.
   */
  const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const {
    data: property,
    error: propertyError,
  } = await supabaseAdmin
    .from("properties")
    .select(
      "id, user_id, plan, payment_status, stripe_session_id"
    )
    .eq("id", propertyId)
    .eq("user_id", metadataUserId)
    .maybeSingle();

  if (propertyError) {
    console.error(
      "Stripe webhook property lookup error:",
      propertyError
    );

    /*
     * Return 500 so Stripe can retry the
     * webhook later.
     */
    return NextResponse.json(
      {
        error:
          "Unable to verify property.",
      },
      {
        status: 500,
      }
    );
  }

  if (!property) {
    console.error(
      "Stripe webhook could not match the payment to an owned property.",
      {
        sessionId: session.id,
        propertyId,
      }
    );

    return NextResponse.json(
      {
        error:
          "Property could not be verified.",
      },
      {
        status: 400,
      }
    );
  }

  /*
   * Stripe may deliver the same webhook more
   * than once. Make processing idempotent.
   */
  if (
    property.payment_status === "paid" &&
    property.stripe_session_id ===
      session.id &&
    property.plan === plan
  ) {
    return NextResponse.json({
      received: true,
      alreadyProcessed: true,
    });
  }

  /*
   * Do not silently replace a different
   * completed payment already attached to
   * this property.
   */
  if (
    property.payment_status === "paid" &&
    property.stripe_session_id &&
    property.stripe_session_id !==
      session.id
  ) {
    console.error(
      "Property already has a different completed Stripe payment.",
      {
        propertyId,
        existingSessionId:
          property.stripe_session_id,
        incomingSessionId:
          session.id,
      }
    );

    return NextResponse.json(
      {
        error:
          "Property already has another completed payment.",
      },
      {
        status: 409,
      }
    );
  }

  /*
   * Keep the webhook activation consistent
   * with /api/activate-paid-listing.
   *
   * The webhook is the server-to-server
   * fallback if the customer's browser closes
   * before the success page can activate the
   * listing.
   */
  const updates: {
    status: "active";
    plan: AllowedPlan;
    payment_status: "paid";
    stripe_session_id: string;
    featured?: boolean;
    is_promoted?: boolean;
  } = {
    status: "active",
    plan,
    payment_status: "paid",
    stripe_session_id:
      session.id,
  };

  /*
   * Preserve the existing HomeLinker Premium
   * promotion behaviour.
   */
  if (plan === "premium") {
    updates.featured = true;
    updates.is_promoted = true;
  }

  const {
    data: updatedProperty,
    error: updateError,
  } = await supabaseAdmin
    .from("properties")
    .update(updates)
    .eq("id", propertyId)
    .eq("user_id", metadataUserId)
    .select("id")
    .maybeSingle();

  if (updateError) {
    console.error(
      "Stripe webhook property update error:",
      updateError
    );

    /*
     * Return 500 so Stripe can retry.
     */
    return NextResponse.json(
      {
        error:
          "Database update failed.",
      },
      {
        status: 500,
      }
    );
  }

  if (!updatedProperty) {
    console.error(
      "Stripe webhook property update matched no property.",
      {
        sessionId: session.id,
        propertyId,
      }
    );

    return NextResponse.json(
      {
        error:
          "Property could not be updated.",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    received: true,
    success: true,
  });
}