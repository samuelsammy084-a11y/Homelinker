import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const PREMIUM_PRICE = 24000; // R240.00
const PRO_PRICE = 55000; // R550.00

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

    if (
      !stripeSecretKey ||
      !supabaseUrl ||
      !supabaseAnonKey ||
      !supabaseServiceRoleKey
    ) {
      console.error(
        "Missing Stripe or Supabase environment variables."
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
            Authorization: `Bearer ${accessToken}`,
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
    // VERIFY ADVERTISER IDENTITY
    // ==================================================
    //
    // Paying for Premium or Pro must never buy
    // verification.
    //
    // The advertiser must already have completed
    // HomeLinker's identity verification process.

    const {
      data: profile,
      error: profileError,
    } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, role, is_verified, verification_status"
      )
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error(
        "Checkout profile lookup error:",
        profileError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify your HomeLinker account.",
        },
        {
          status: 500,
        }
      );
    }

    if (!profile) {
      return NextResponse.json(
        {
          error:
            "Your HomeLinker profile could not be found.",
          code: "PROFILE_NOT_FOUND",
        },
        {
          status: 403,
        }
      );
    }

    if (
      profile.is_verified !== true ||
      profile.verification_status !==
        "verified"
    ) {
      return NextResponse.json(
        {
          error:
            "Identity verification is required before purchasing a listing plan.",
          code:
            "IDENTITY_VERIFICATION_REQUIRED",
          verificationUrl: "/verify",
        },
        {
          status: 403,
        }
      );
    }

    // ==================================================
    // READ + VALIDATE REQUEST
    // ==================================================

    let body: {
      propertyId?: unknown;
      plan?: unknown;
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

    const requestedPlan =
      typeof body?.plan === "string"
        ? body.plan.trim().toLowerCase()
        : "";

    if (
      !ALLOWED_PLANS.includes(
        requestedPlan as AllowedPlan
      )
    ) {
      return NextResponse.json(
        {
          error: "Invalid plan.",
        },
        {
          status: 400,
        }
      );
    }

    const plan =
      requestedPlan as AllowedPlan;

    const propertyId = Number(
      body?.propertyId
    );

    if (
      !Number.isInteger(propertyId) ||
      propertyId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid property ID.",
        },
        {
          status: 400,
        }
      );
    }

    // ==================================================
    // VERIFY PROPERTY OWNERSHIP
    // ==================================================
    //
    // Premium:
    // The payment promotes this exact property.
    //
    // Pro:
    // The payment belongs to the advertiser account,
    // but the selected property becomes the first
    // property we can attach to the Pro experience
    // after payment.

    const {
      data: property,
      error: propertyError,
    } = await supabaseAdmin
      .from("properties")
      .select(
        "id, user_id, status, plan, payment_status"
      )
      .eq("id", propertyId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (propertyError) {
      console.error(
        "Checkout property lookup error:",
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
            "Property not found or you do not have permission to purchase a plan for it.",
        },
        {
          status: 403,
        }
      );
    }

    // ==================================================
    // PREVENT DUPLICATE ACTIVE PRO PURCHASE
    // ==================================================
    //
    // Pro is an account-level 30-day package.
    // Don't charge someone R550 again while they
    // already have an active Pro entitlement.

    if (plan === "pro") {
      const nowIso =
        new Date().toISOString();

      const {
        data: activePro,
        error: activeProError,
      } = await supabaseAdmin
        .from("advertiser_subscriptions")
        .select(
          "id, plan, status, starts_at, expires_at"
        )
        .eq("user_id", user.id)
        .eq("plan", "pro")
        .eq("status", "active")
        .gt("expires_at", nowIso)
        .order("expires_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (activeProError) {
        console.error(
          "Active Pro lookup error:",
          activeProError
        );

        return NextResponse.json(
          {
            error:
              "Unable to check your current Pro plan.",
          },
          {
            status: 500,
          }
        );
      }

      if (activePro) {
        return NextResponse.json(
          {
            error:
              "You already have an active Pro plan.",
            code: "PRO_ALREADY_ACTIVE",
            expiresAt: activePro.expires_at,
          },
          {
            status: 409,
          }
        );
      }
    }

    // ==================================================
    // SERVER-CONTROLLED PRODUCT DETAILS
    // ==================================================
    //
    // Never accept price, duration or product
    // description from the browser.

    const isPremium =
      plan === "premium";

    const price = isPremium
      ? PREMIUM_PRICE
      : PRO_PRICE;

    const name = isPremium
      ? "HomeLinker Premium — 30 Days"
      : "HomeLinker Pro — 30 Days";

    const description = isPremium
      ? "30-day promotion for one HomeLinker property listing."
      : "30-day HomeLinker Pro advertiser package.";

    const purchaseType = isPremium
      ? "property"
      : "account";

    // ==================================================
    // STRIPE
    // ==================================================

    const stripe = new Stripe(
      stripeSecretKey
    );

    // ==================================================
    // SAFE REDIRECT ORIGIN
    // ==================================================

    const requestOrigin =
      req.headers.get("origin");

    const allowedOrigins = new Set([
      "https://homelinker.co.za",
      "https://www.homelinker.co.za",
      "http://localhost:3000",
    ]);

    const origin =
      requestOrigin &&
      allowedOrigins.has(requestOrigin)
        ? requestOrigin
        : "https://homelinker.co.za";

    // ==================================================
    // CREATE CHECKOUT SESSION
    // ==================================================

    const checkoutMetadata: Record<
      string,
      string
    > = {
      plan,
      userId: user.id,
      purchaseType,
      durationDays: "30",
    };

    /*
     * Premium is a property purchase.
     *
     * Pro is an account purchase, but we retain
     * the originating property separately so it
     * can become the advertiser's first promoted
     * Pro listing after successful payment.
     */
    if (isPremium) {
      checkoutMetadata.propertyId =
        String(propertyId);
    } else {
      checkoutMetadata.initialPropertyId =
        String(propertyId);
    }

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        payment_method_types: ["card"],

        line_items: [
          {
            quantity: 1,

            price_data: {
              currency: "zar",

              unit_amount: price,

              product_data: {
                name,
                description,
              },
            },
          },
        ],

        metadata: checkoutMetadata,

        client_reference_id: user.id,

        success_url:
          `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${origin}/pricing?propertyId=${encodeURIComponent(
            String(propertyId)
          )}`,
      });

    if (!session.url) {
      console.error(
        "Stripe Checkout Session did not return a URL."
      );

      return NextResponse.json(
        {
          error:
            "Unable to start payment.",
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
      url: session.url,
    });
  } catch (error) {
    console.error(
      "HomeLinker checkout error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create checkout session.",
      },
      {
        status: 500,
      }
    );
  }
}