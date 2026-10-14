import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const ALLOWED_PLANS = ["premium", "pro"] as const;

type AllowedPlan = (typeof ALLOWED_PLANS)[number];

export async function POST(req: Request) {
  try {
    const stripeSecretKey =
      process.env.STRIPE_SECRET_KEY;

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (
      !stripeSecretKey ||
      !supabaseUrl ||
      !supabaseAnonKey
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

    /*
     * Authenticate the HomeLinker user.
     */
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

    const supabase = createClient(
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
    } = await supabase.auth.getUser(
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

    /*
     * Validate request data.
     */
    const body = await req.json();

    const propertyId = Number(
      body?.propertyId
    );

    const requestedPlan =
      typeof body?.plan === "string"
        ? body.plan.trim().toLowerCase()
        : "";

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

    /*
     * Verify ownership BEFORE creating a
     * Stripe Checkout Session.
     *
     * This uses the authenticated user's
     * Supabase session and your existing RLS.
     */
    const {
      data: property,
      error: propertyError,
    } = await supabase
      .from("properties")
      .select("id, user_id")
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

    /*
     * Server-controlled pricing.
     *
     * Never accept a price from the browser.
     */
    let price: number;
    let name: string;

    if (plan === "premium") {
      price = 4900;
      name =
        "HomeLinker Premium Listing";
    } else {
      price = 19900;
      name =
        "HomeLinker Pro Listing";
    }

    const stripe = new Stripe(
      stripeSecretKey
    );

    /*
     * Only allow HomeLinker's production domain
     * or localhost as redirect origins.
     *
     * Do not blindly trust the Origin header.
     */
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
              },
            },
          },
        ],

        /*
         * Stripe metadata is server-generated
         * only after ownership has been verified.
         */
        metadata: {
          propertyId:
            String(propertyId),

          plan,

          userId: user.id,
        },

        /*
         * Also associate the Checkout Session
         * with the authenticated HomeLinker user.
         */
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