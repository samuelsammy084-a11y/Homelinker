import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const PREMIUM_PRICE = 24000;
const PRO_PRICE = 55000;
const PROMOTION_DAYS = 30;

type Plan = "premium" | "pro";
type PurchaseType = "property" | "account";

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function getPaymentIntentId(
  paymentIntent:
    | string
    | Stripe.PaymentIntent
    | null
) {
  if (!paymentIntent) {
    return null;
  }

  if (typeof paymentIntent === "string") {
    return paymentIntent;
  }

  return paymentIntent.id;
}

export async function POST(req: Request) {
  try {
    // ==================================================
    // ENVIRONMENT
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
    // RAW STRIPE BODY
    // ==================================================

    const rawBody = await req.text();

    const signature =
      req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        {
          error: "Missing Stripe signature.",
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
          rawBody,
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
    // ONLY HANDLE CHECKOUT COMPLETION
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
      event.data
        .object as Stripe.Checkout.Session;

    // ==================================================
    // PAYMENT MUST BE PAID
    // ==================================================

    if (session.payment_status !== "paid") {
      return NextResponse.json({
        received: true,
      });
    }

    // ==================================================
    // VALIDATE METADATA
    // ==================================================

    const metadata =
      session.metadata ?? {};

    const userId =
      metadata.userId?.trim();

    const rawPlan =
      metadata.plan
        ?.trim()
        .toLowerCase();

    const rawPurchaseType =
      metadata.purchaseType
        ?.trim()
        .toLowerCase();

    const durationDays =
      Number(metadata.durationDays);

    if (
      !userId ||
      (rawPlan !== "premium" &&
        rawPlan !== "pro") ||
      (rawPurchaseType !== "property" &&
        rawPurchaseType !== "account")
    ) {
      console.error(
        "Stripe payment metadata is invalid.",
        {
          sessionId: session.id,
        }
      );

      return NextResponse.json(
        {
          error:
            "Payment metadata is incomplete or invalid.",
        },
        {
          status: 400,
        }
      );
    }

    const plan =
      rawPlan as Plan;

    const purchaseType =
      rawPurchaseType as PurchaseType;

    // Premium = property purchase.
    // Pro = account purchase.

    if (
      (plan === "premium" &&
        purchaseType !== "property") ||
      (plan === "pro" &&
        purchaseType !== "account")
    ) {
      return NextResponse.json(
        {
          error:
            "Payment plan and purchase type do not match.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isInteger(durationDays) ||
      durationDays !== PROMOTION_DAYS
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid promotion duration.",
        },
        {
          status: 400,
        }
      );
    }

    // ==================================================
    // VERIFY USER ASSOCIATION
    // ==================================================

    if (
      session.client_reference_id !==
      userId
    ) {
      console.error(
        "Stripe client_reference_id does not match userId.",
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
    // VERIFY AMOUNT + CURRENCY
    // ==================================================

    const expectedAmount =
      plan === "premium"
        ? PREMIUM_PRICE
        : PRO_PRICE;

    if (
      session.amount_total !==
      expectedAmount
    ) {
      console.error(
        "Stripe payment amount does not match HomeLinker plan.",
        {
          sessionId: session.id,
          plan,
          expectedAmount,
          receivedAmount:
            session.amount_total,
        }
      );

      return NextResponse.json(
        {
          error:
            "Payment amount does not match the selected plan.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      session.currency?.toLowerCase() !==
      "zar"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid payment currency.",
        },
        {
          status: 400,
        }
      );
    }

    const paymentIntentId =
      getPaymentIntentId(
        session.payment_intent
      );

    // ==================================================
    // ADMIN DATABASE CLIENT
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
    // PAYMENT LEDGER / IDEMPOTENCY
    // ==================================================

    const {
      data: existingPayment,
      error: existingPaymentError,
    } = await supabaseAdmin
      .from("payments")
      .select(
        "id, user_id, property_id, plan, purchase_type, status"
      )
      .eq(
        "stripe_session_id",
        session.id
      )
      .maybeSingle();

    if (existingPaymentError) {
      console.error(
        "Stripe payment idempotency lookup failed:",
        existingPaymentError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify payment state.",
        },
        {
          status: 500,
        }
      );
    }

    if (existingPayment) {
      if (
        existingPayment.user_id !==
          userId ||
        existingPayment.plan !== plan ||
        existingPayment.purchase_type !==
          purchaseType
      ) {
        console.error(
          "Existing payment does not match incoming Stripe metadata.",
          {
            sessionId: session.id,
          }
        );

        return NextResponse.json(
          {
            error:
              "Existing payment information does not match.",
          },
          {
            status: 409,
          }
        );
      }

      return NextResponse.json({
        received: true,
        success: true,
        alreadyProcessed: true,
        plan,
      });
    }

    // ==================================================
    // PREMIUM
    // ==================================================

    if (plan === "premium") {
      const propertyId =
        Number(metadata.propertyId);

      if (
        !Number.isInteger(propertyId) ||
        propertyId <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "Premium payment contains an invalid property.",
          },
          {
            status: 400,
          }
        );
      }

      // ----------------------------------------------
      // VERIFY PROPERTY OWNERSHIP
      // ----------------------------------------------

      const {
        data: property,
        error: propertyError,
      } = await supabaseAdmin
        .from("properties")
        .select(
          "id, user_id, stripe_session_id, promotion_source, promotion_starts_at, promotion_expires_at"
        )
        .eq("id", propertyId)
        .eq("user_id", userId)
        .maybeSingle();

      if (propertyError) {
        console.error(
          "Premium property lookup failed:",
          propertyError
        );

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
        return NextResponse.json(
          {
            error:
              "Premium property could not be verified.",
          },
          {
            status: 400,
          }
        );
      }

      // ----------------------------------------------
      // PREMIUM DATES
      // ----------------------------------------------
      //
      // If the browser reconciliation endpoint
      // already activated THIS EXACT Stripe session,
      // preserve those dates.
      //
      // Otherwise create a fresh 30-day period.
      //
      // This prevents an older Premium/Pro promotion
      // from donating its dates to this purchase.

      const samePremiumSession =
        property.stripe_session_id ===
          session.id &&
        property.promotion_source ===
          "premium" &&
        Boolean(
          property.promotion_starts_at
        ) &&
        Boolean(
          property.promotion_expires_at
        );

      let startsIso: string;
      let expiresIso: string;

      if (samePremiumSession) {
        startsIso =
          property.promotion_starts_at as string;

        expiresIso =
          property.promotion_expires_at as string;
      } else {
        const startsAt =
          new Date();

        const expiresAt =
          addDays(
            startsAt,
            PROMOTION_DAYS
          );

        startsIso =
          startsAt.toISOString();

        expiresIso =
          expiresAt.toISOString();
      }

      // ----------------------------------------------
      // ACTIVATE PREMIUM
      // ----------------------------------------------

      const {
        data: updatedProperty,
        error: propertyUpdateError,
      } = await supabaseAdmin
        .from("properties")
        .update({
          status: "active",

          plan: "premium",

          payment_status: "paid",

          stripe_session_id:
            session.id,

          featured: true,

          is_promoted: true,

          is_priority: false,

          promotion_source:
            "premium",

          promotion_starts_at:
            startsIso,

          promotion_expires_at:
            expiresIso,

          featured_until:
            expiresIso,
        })
        .eq("id", propertyId)
        .eq("user_id", userId)
        .select("id")
        .maybeSingle();

      if (
        propertyUpdateError ||
        !updatedProperty
      ) {
        console.error(
          "Premium property activation failed:",
          propertyUpdateError
        );

        return NextResponse.json(
          {
            error:
              "Unable to activate Premium listing.",
          },
          {
            status: 500,
          }
        );
      }

      // ----------------------------------------------
      // RECORD PREMIUM PAYMENT
      // ----------------------------------------------

      const {
        error: paymentInsertError,
      } = await supabaseAdmin
        .from("payments")
        .insert({
          user_id: userId,

          property_id: propertyId,

          plan: "premium",

          purchase_type:
            "property",

          amount: PREMIUM_PRICE,

          currency: "zar",

          status: "paid",

          stripe_session_id:
            session.id,

          stripe_payment_intent_id:
            paymentIntentId,
        });

      if (paymentInsertError) {
        /*
         * The browser reconciliation endpoint may
         * have inserted the payment while the
         * webhook was running.
         *
         * Re-query instead of incorrectly failing
         * a successful Stripe payment.
         */

        const {
          data: recoveredPayment,
          error: recoveryError,
        } = await supabaseAdmin
          .from("payments")
          .select(
            "id, user_id, property_id, plan, purchase_type"
          )
          .eq(
            "stripe_session_id",
            session.id
          )
          .maybeSingle();

        if (
          recoveryError ||
          !recoveredPayment ||
          recoveredPayment.user_id !==
            userId ||
          recoveredPayment.plan !==
            "premium" ||
          recoveredPayment.purchase_type !==
            "property" ||
          Number(
            recoveredPayment.property_id
          ) !== propertyId
        ) {
          console.error(
            "Premium payment ledger insert failed:",
            paymentInsertError
          );

          return NextResponse.json(
            {
              error:
                "Premium was activated, but the payment record could not be confirmed.",
            },
            {
              status: 500,
            }
          );
        }
      }

      return NextResponse.json({
        received: true,
        success: true,
        plan: "premium",
        propertyId,
        expiresAt: expiresIso,
      });
    }

    // ==================================================
    // PRO
    // ==================================================

    const initialPropertyId =
      Number(
        metadata.initialPropertyId
      );

    if (
      !Number.isInteger(
        initialPropertyId
      ) ||
      initialPropertyId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Pro payment contains an invalid initial property.",
        },
        {
          status: 400,
        }
      );
    }

    // ----------------------------------------------
    // VERIFY INITIAL PROPERTY
    // ----------------------------------------------

    const {
      data: initialProperty,
      error: initialPropertyError,
    } = await supabaseAdmin
      .from("properties")
      .select("id, user_id")
      .eq("id", initialPropertyId)
      .eq("user_id", userId)
      .maybeSingle();

    if (initialPropertyError) {
      console.error(
        "Pro initial property lookup failed:",
        initialPropertyError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify initial Pro property.",
        },
        {
          status: 500,
        }
      );
    }

    if (!initialProperty) {
      return NextResponse.json(
        {
          error:
            "Initial Pro property could not be verified.",
        },
        {
          status: 400,
        }
      );
    }

    // ==================================================
    // FIND EXISTING PRO SUBSCRIPTION FOR THIS SESSION
    // ==================================================

    let {
      data: proSubscription,
      error: proSubscriptionLookupError,
    } = await supabaseAdmin
      .from(
        "advertiser_subscriptions"
      )
      .select(
        "id, user_id, starts_at, expires_at, stripe_session_id"
      )
      .eq(
        "stripe_session_id",
        session.id
      )
      .maybeSingle();

    if (proSubscriptionLookupError) {
      console.error(
        "Pro subscription lookup failed:",
        proSubscriptionLookupError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify Pro activation.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      proSubscription &&
      proSubscription.user_id !==
        userId
    ) {
      return NextResponse.json(
        {
          error:
            "This Pro payment belongs to another account.",
        },
        {
          status: 409,
        }
      );
    }

    // ==================================================
    // CREATE PRO SUBSCRIPTION IF NEEDED
    // ==================================================

    if (!proSubscription) {
      const startsAt =
        new Date();

      const expiresAt =
        addDays(
          startsAt,
          PROMOTION_DAYS
        );

      const startsIso =
        startsAt.toISOString();

      const expiresIso =
        expiresAt.toISOString();

      const {
        data: createdSubscription,
        error: createSubscriptionError,
      } = await supabaseAdmin
        .from(
          "advertiser_subscriptions"
        )
        .insert({
          user_id: userId,

          plan: "pro",

          status: "active",

          listing_limit: 10,

          priority_listing_limit: 3,

          starts_at:
            startsIso,

          expires_at:
            expiresIso,

          stripe_session_id:
            session.id,

          stripe_payment_intent_id:
            paymentIntentId,

          amount_paid:
            PRO_PRICE,

          currency: "zar",
        })
        .select(
          "id, user_id, starts_at, expires_at, stripe_session_id"
        )
        .single();

      if (createSubscriptionError) {
        /*
         * Browser reconciliation may have created
         * the same subscription at the same time.
         */

        const {
          data: recoveredSubscription,
          error: recoveryError,
        } = await supabaseAdmin
          .from(
            "advertiser_subscriptions"
          )
          .select(
            "id, user_id, starts_at, expires_at, stripe_session_id"
          )
          .eq(
            "stripe_session_id",
            session.id
          )
          .maybeSingle();

        if (
          recoveryError ||
          !recoveredSubscription ||
          recoveredSubscription.user_id !==
            userId
        ) {
          console.error(
            "Pro subscription creation failed:",
            createSubscriptionError
          );

          return NextResponse.json(
            {
              error:
                "Unable to activate Pro plan.",
            },
            {
              status: 500,
            }
          );
        }

        proSubscription =
          recoveredSubscription;
      } else {
        proSubscription =
          createdSubscription;
      }
    }

    // ==================================================
    // USE AUTHORITATIVE SUBSCRIPTION DATES
    // ==================================================
    //
    // This is important:
    //
    // whichever request created the subscription
    // first owns the 30-day dates.
    //
    // Both the webhook and browser reconciliation
    // then use the same dates.

    const startsIso =
      proSubscription.starts_at;

    const expiresIso =
      proSubscription.expires_at;

    // ==================================================
    // PROMOTE FIRST PRO PROPERTY
    // ==================================================

    const {
      data: updatedProProperty,
      error: proPropertyError,
    } = await supabaseAdmin
      .from("properties")
      .update({
        status: "active",

        plan: "pro",

        payment_status: "paid",

        featured: true,

        is_promoted: true,

        is_priority: false,

        promotion_source:
          "pro",

        promotion_starts_at:
          startsIso,

        promotion_expires_at:
          expiresIso,

        featured_until:
          expiresIso,
      })
      .eq(
        "id",
        initialPropertyId
      )
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();

    if (
      proPropertyError ||
      !updatedProProperty
    ) {
      console.error(
        "Initial Pro property activation failed:",
        proPropertyError
      );

      return NextResponse.json(
        {
          error:
            "Pro was activated, but the initial property could not be promoted.",
        },
        {
          status: 500,
        }
      );
    }

    // ==================================================
    // RECORD PRO PAYMENT
    // ==================================================

    const {
      error: proPaymentError,
    } = await supabaseAdmin
      .from("payments")
      .insert({
        user_id: userId,

        // Pro is account-level.
        property_id: null,

        plan: "pro",

        purchase_type:
          "account",

        amount: PRO_PRICE,

        currency: "zar",

        status: "paid",

        stripe_session_id:
          session.id,

        stripe_payment_intent_id:
          paymentIntentId,
      });

    if (proPaymentError) {
      /*
       * Browser reconciliation may have inserted
       * the same payment first.
       */

      const {
        data: recoveredPayment,
        error: recoveryError,
      } = await supabaseAdmin
        .from("payments")
        .select(
          "id, user_id, plan, purchase_type"
        )
        .eq(
          "stripe_session_id",
          session.id
        )
        .maybeSingle();

      if (
        recoveryError ||
        !recoveredPayment ||
        recoveredPayment.user_id !==
          userId ||
        recoveredPayment.plan !==
          "pro" ||
        recoveredPayment.purchase_type !==
          "account"
      ) {
        console.error(
          "Pro payment ledger insert failed:",
          proPaymentError
        );

        return NextResponse.json(
          {
            error:
              "Pro was activated, but the payment record could not be confirmed.",
          },
          {
            status: 500,
          }
        );
      }
    }

    // ==================================================
    // SUCCESS
    // ==================================================

    return NextResponse.json({
      received: true,
      success: true,

      plan: "pro",

      subscriptionId:
        proSubscription.id,

      initialPropertyId,

      expiresAt:
        expiresIso,
    });
  } catch (error) {
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