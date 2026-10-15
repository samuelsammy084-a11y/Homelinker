import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const ALLOWED_PLANS = ["premium", "pro"] as const;

type AllowedPlan = (typeof ALLOWED_PLANS)[number];

export async function POST(req: Request) {
  try {
    // ==================================================
    // ENVIRONMENT VARIABLES
    // ==================================================

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

    // ==================================================
    // READ RAW STRIPE BODY
    // ==================================================
    //
    // Stripe signature verification requires the
    // original raw request body.

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

    // ==================================================
    // VERIFY STRIPE SIGNATURE
    // ==================================================

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

    // ==================================================
    // ONLY PROCESS CHECKOUT COMPLETION
    // ==================================================

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

    // ==================================================
    // CONFIRM PAYMENT
    // ==================================================
    //
    // A completed Checkout Session is not enough.
    // Stripe itself must report payment as paid.

    if (
      session.payment_status !== "paid"
    ) {
      return NextResponse.json({
        received: true,
      });
    }

    // ==================================================
    // READ TRUSTED STRIPE METADATA
    // ==================================================

    const metadataPropertyId =
      session.metadata?.propertyId;

    const metadataPlan =
      session.metadata?.plan;

    const metadataUserId =
      session.metadata?.userId;

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

    // ==================================================
    // VALIDATE PROPERTY ID
    // ==================================================

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

    // ==================================================
    // VALIDATE PLAN
    // ==================================================

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

    // ==================================================
    // VERIFY STRIPE USER INFORMATION
    // ==================================================
    //
    // Checkout creation stores the authenticated
    // HomeLinker user in both metadata and
    // client_reference_id.

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

    // ==================================================
    // SERVER-ONLY SUPABASE CLIENT
    // ==================================================

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

    // ==================================================
    // VERIFY PROPERTY + OWNERSHIP
    // ==================================================

    const {
      data: property,
      error: propertyError,
    } = await supabaseAdmin
      .from("properties")
      .select(
        "id, user_id, status, plan, payment_status, stripe_session_id"
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

    // ==================================================
    // IDEMPOTENCY
    // ==================================================
    //
    // Stripe can deliver the same webhook more
    // than once. Reprocessing the exact same
    // completed payment must be harmless.

    if (
      property.payment_status === "paid" &&
      property.stripe_session_id ===
        session.id &&
      property.plan === plan
    ) {
      return NextResponse.json({
        received: true,
        success: true,
        alreadyProcessed: true,
      });
    }

    // ==================================================
    // PROTECT EXISTING COMPLETED PAYMENT
    // ==================================================

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

    // ==================================================
    // ACTIVATE PAID LISTING
    // ==================================================
    //
    // This must stay consistent with:
    //
    // /api/activate-paid-listing
    //
    // Both Premium and Pro are paid promotional
    // plans, so both receive featured/promoted
    // placement.

    const {
      data: updatedProperty,
      error: updateError,
    } = await supabaseAdmin
      .from("properties")
      .update({
        status: "active",

        plan,

        payment_status: "paid",

        stripe_session_id:
          session.id,

        featured: true,

        is_promoted: true,
      })
      .eq("id", propertyId)
      .eq("user_id", metadataUserId)
      .select(
        "id, status, plan, payment_status, featured, is_promoted"
      )
      .maybeSingle();

    if (updateError) {
      console.error(
        "Stripe webhook property update error:",
        updateError
      );

      /*
       * Return 500 so Stripe retries this webhook.
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

    // ==================================================
    // SUCCESS
    // ==================================================

    return NextResponse.json({
      received: true,

      success: true,

      propertyId:
        updatedProperty.id,

      plan:
        updatedProperty.plan,

      status:
        updatedProperty.status,

      paymentStatus:
        updatedProperty.payment_status,

      featured:
        updatedProperty.featured,

      isPromoted:
        updatedProperty.is_promoted,
    });
  } catch (error) {
    /*
     * Returning 500 is important here.
     *
     * Stripe can retry the webhook if something
     * unexpected temporarily fails.
     */
    console.error(
      "Unexpected Stripe webhook error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Webhook processing failed.",
      },
      {
        status: 500,
      }
    );
  }
}