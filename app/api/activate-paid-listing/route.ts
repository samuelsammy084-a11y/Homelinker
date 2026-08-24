import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

const supabaseAdmin =
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export async function POST(req: Request) {
  try {
    const { sessionId } =
      await req.json();

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

    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId
      );

    if (
      session.payment_status !==
      "paid"
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

    const {
      error: updateError,
    } = await supabaseAdmin
      .from("properties")
      .update({
        status: "active",
        plan,
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