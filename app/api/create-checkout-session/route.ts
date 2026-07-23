import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { plan, propertyId } = await req.json();

    let price = 0;
    let name = "";

    if (plan === "premium") {
      price = 4900; // R49
      name = "HomeLinker Premium Listing";
    } else if (plan === "pro") {
      price = 19900; // R199
      name = "HomeLinker Pro Subscription";
    } else {
      return NextResponse.json(
        { error: "Invalid plan." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
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

      metadata: {
        propertyId,
        plan,
      },

      success_url: `${req.headers.get("origin")}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${req.headers.get("origin")}/pricing`,
    });

    return NextResponse.json({
      url: session.url,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Failed to create checkout session",
      },
      {
        status: 500,
      }
    );
  }
}