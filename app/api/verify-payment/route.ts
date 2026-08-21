import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing Stripe session ID." },
        { status: 400 }
      );
    }

    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId
      );

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        {
          error:
            "Payment has not been completed.",
        },
        { status: 400 }
      );
    }

    const propertyId =
      session.metadata?.propertyId;

    const plan =
      session.metadata?.plan;

    if (!propertyId) {
      return NextResponse.json(
        {
          error:
            "No property was attached to this payment.",
        },
        { status: 400 }
      );
    }

    const { error } =
      await supabaseAdmin
        .from("properties")
        .update({
          status: "active",
          plan: plan || "premium",
        })
        .eq("id", propertyId);

    if (error) {
      console.error(
        "Property activation error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Payment succeeded but the listing could not be activated.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      propertyId,
      plan,
    });
  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to verify payment.",
      },
      { status: 500 }
    );
  }
}