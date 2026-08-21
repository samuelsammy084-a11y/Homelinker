import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key");
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

// Create a service role client to bypass RLS for updating payment status
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"
);


export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { propertyId, plan } = session.metadata || {};

    if (propertyId) {
      const updates: any = {
        payment_status: "paid",
        updated_at: new Date().toISOString(),
      };

      if (plan === "premium") {
        updates.is_promoted = true;
        updates.featured = true;
      }

      const { error } = await supabaseAdmin
        .from("properties")
        .update(updates)
        .eq("id", propertyId);

      if (error) {
        console.error("Error updating property after payment:", error);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
