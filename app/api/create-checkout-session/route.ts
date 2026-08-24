import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

export async function POST(req: Request) {
  try {
    const { plan, propertyId } = await req.json();

    if (!propertyId) {
      return NextResponse.json(
        {
          error: "Property ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (plan !== "premium" && plan !== "pro") {
      return NextResponse.json(
        {
          error: "Invalid plan.",
        },
        {
          status: 400,
        }
      );
    }

    let price = 0;
    let name = "";

    if (plan === "premium") {
      price = 4900;
      name = "HomeLinker Premium Listing";
    }

    if (plan === "pro") {
      price = 19900;
      name = "HomeLinker Pro Listing";
    }

    const origin =
      req.headers.get("origin") ||
      "https://homelinker.co.za";

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

        metadata: {
          propertyId: String(propertyId),
          plan,
        },

        success_url:
          `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${origin}/pricing?propertyId=${encodeURIComponent(
            String(propertyId)
          )}`,
      });

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