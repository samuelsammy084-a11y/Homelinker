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

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
      !supabaseAnonKey ||
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

    // ==================================================
    // AUTHENTICATE USER
    // ==================================================

    const authorization =
      req.headers.get("authorization");

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    const accessToken = authorization
      .slice("Bearer ".length)
      .trim();

    if (!accessToken) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    const supabaseUser = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },

        global: {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseUser.auth.getUser(
      accessToken
    );

    if (authError || !user) {
      return NextResponse.json(
        {
          error:
            "Your session is invalid or has expired.",
        },
        {
          status: 401,
        }
      );
    }

    // ==================================================
    // READ REQUEST
    // ==================================================

    let body: {
      sessionId?: unknown;
    };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request body.",
        },
        {
          status: 400,
        }
      );
    }

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

    // ==================================================
    // VERIFY PAYMENT DIRECTLY WITH STRIPE
    // ==================================================

    const stripe = new Stripe(
      stripeSecretKey
    );

    let session: Stripe.Checkout.Session;

    try {
      session =
        await stripe.checkout.sessions.retrieve(
          sessionId
        );
    } catch (error) {
      console.error(
        "Stripe session lookup error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "The payment session could not be verified.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Never trust the browser to tell us whether
     * payment succeeded.
     *
     * Stripe itself must report the session as paid.
     */
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

    // ==================================================
    // VALIDATE STRIPE METADATA
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

    const propertyId = Number(
      metadataPropertyId
    );

    if (
      !Number.isInteger(propertyId) ||
      propertyId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Payment contains an invalid property ID.",
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
      return NextResponse.json(
        {
          error:
            "Payment contains an invalid plan.",
        },
        {
          status: 400,
        }
      );
    }

    const plan =
      metadataPlan as AllowedPlan;

    // ==================================================
    // VERIFY PAYMENT BELONGS TO CURRENT USER
    // ==================================================

    if (
      metadataUserId !== user.id ||
      session.client_reference_id !==
        user.id
    ) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to activate this payment.",
        },
        {
          status: 403,
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
    // VERIFY PROPERTY OWNERSHIP
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
      .eq("user_id", user.id)
      .maybeSingle();

    if (propertyError) {
      console.error(
        "Paid listing property lookup error:",
        propertyError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify the property.",
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
            "Property not found or you do not have permission to activate it.",
        },
        {
          status: 403,
        }
      );
    }

    // ==================================================
    // IDEMPOTENCY
    // ==================================================

    /*
     * Stripe/web browsers can cause activation
     * requests to happen more than once.
     *
     * If this exact payment already activated
     * this exact plan, return success.
     */
    if (
      property.payment_status === "paid" &&
      property.stripe_session_id ===
        session.id &&
      property.plan === plan
    ) {
      return NextResponse.json({
        success: true,
        propertyId,
        plan,
        status: property.status,
        alreadyActivated: true,
      });
    }

    /*
     * Do not overwrite a different completed
     * Stripe payment already attached to this
     * property.
     */
    if (
      property.payment_status === "paid" &&
      property.stripe_session_id &&
      property.stripe_session_id !==
        session.id
    ) {
      return NextResponse.json(
        {
          error:
            "This property already has a different completed payment.",
        },
        {
          status: 409,
        }
      );
    }

    // ==================================================
    // ACTIVATE PAID LISTING
    // ==================================================

    /*
     * Premium and Pro are both paid/promoted
     * HomeLinker plans.
     *
     * Both therefore receive featured and
     * promoted placement.
     */
    const {
      data: updatedProperty,
      error: updateError,
    } = await supabaseAdmin
      .from("properties")
      .update({
        status: "active",
        plan,
        payment_status: "paid",
        stripe_session_id: session.id,

        featured: true,
        is_promoted: true,
      })
      .eq("id", propertyId)
      .eq("user_id", user.id)
      .select(
        "id, status, plan, payment_status, featured, is_promoted"
      )
      .maybeSingle();

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

    if (!updatedProperty) {
      return NextResponse.json(
        {
          error:
            "The property could not be activated.",
        },
        {
          status: 409,
        }
      );
    }

    // ==================================================
    // SUCCESS
    // ==================================================

    return NextResponse.json({
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

      alreadyActivated: false,
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