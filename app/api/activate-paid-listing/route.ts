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
        "Paid activation environment variables are missing."
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
    // AUTHENTICATE CURRENT USER
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
    // REQUEST BODY
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
    // VERIFY DIRECTLY WITH STRIPE
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
        "Stripe session lookup failed:",
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

    if (session.payment_status !== "paid") {
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
    // VALIDATE TRUSTED STRIPE METADATA
    // ==================================================

    const metadata =
      session.metadata ?? {};

    const metadataUserId =
      metadata.userId?.trim();

    const rawPlan =
      metadata.plan?.trim().toLowerCase();

    const rawPurchaseType =
      metadata.purchaseType
        ?.trim()
        .toLowerCase();

    const durationDays = Number(
      metadata.durationDays
    );

    if (
      !metadataUserId ||
      (rawPlan !== "premium" &&
        rawPlan !== "pro") ||
      (rawPurchaseType !== "property" &&
        rawPurchaseType !== "account")
    ) {
      return NextResponse.json(
        {
          error:
            "Payment information is incomplete or invalid.",
        },
        {
          status: 400,
        }
      );
    }

    const plan = rawPlan as Plan;

    const purchaseType =
      rawPurchaseType as PurchaseType;

    if (
      (plan === "premium" &&
        purchaseType !== "property") ||
      (plan === "pro" &&
        purchaseType !== "account")
    ) {
      return NextResponse.json(
        {
          error:
            "Payment plan information is invalid.",
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
            "Payment duration is invalid.",
        },
        {
          status: 400,
        }
      );
    }

    // ==================================================
    // VERIFY PAYMENT BELONGS TO CURRENT USER
    // ==================================================

    if (
      metadataUserId !== user.id ||
      session.client_reference_id !== user.id
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
    // VERIFY PRICE + CURRENCY
    // ==================================================

    const expectedAmount =
      plan === "premium"
        ? PREMIUM_PRICE
        : PRO_PRICE;

    if (
      session.amount_total !== expectedAmount ||
      session.currency?.toLowerCase() !== "zar"
    ) {
      console.error(
        "Paid activation amount/currency mismatch.",
        {
          sessionId: session.id,
          plan,
          expectedAmount,
          amountTotal: session.amount_total,
          currency: session.currency,
        }
      );

      return NextResponse.json(
        {
          error:
            "Payment amount does not match the selected HomeLinker plan.",
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
    // CHECK PAYMENT LEDGER
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
        "Payment ledger lookup failed:",
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

    // ==================================================
    // ALREADY PROCESSED
    // ==================================================

    if (existingPayment) {
      if (
        existingPayment.user_id !== user.id ||
        existingPayment.plan !== plan ||
        existingPayment.purchase_type !==
          purchaseType
      ) {
        return NextResponse.json(
          {
            error:
              "Stored payment information does not match this Stripe payment.",
          },
          {
            status: 409,
          }
        );
      }

      // ----------------------------------------------
      // EXISTING PREMIUM PAYMENT
      // ----------------------------------------------

      if (plan === "premium") {
        const propertyId =
          existingPayment.property_id ??
          Number(metadata.propertyId);

        if (
          !Number.isInteger(propertyId) ||
          Number(propertyId) <= 0
        ) {
          return NextResponse.json(
            {
              error:
                "Stored Premium payment is missing its property.",
            },
            {
              status: 409,
            }
          );
        }

        const {
          data: paidProperty,
          error: paidPropertyError,
        } = await supabaseAdmin
          .from("properties")
          .select(
            "id, user_id, stripe_session_id, promotion_source, promotion_expires_at"
          )
          .eq("id", Number(propertyId))
          .eq("user_id", user.id)
          .maybeSingle();

        if (
          paidPropertyError ||
          !paidProperty
        ) {
          console.error(
            "Existing Premium property lookup failed:",
            paidPropertyError
          );

          return NextResponse.json(
            {
              error:
                "Payment was confirmed, but the Premium property could not be verified.",
            },
            {
              status: 500,
            }
          );
        }

        const expiresAt =
          paidProperty.stripe_session_id ===
            session.id &&
          paidProperty.promotion_source ===
            "premium"
            ? paidProperty.promotion_expires_at
            : null;

        return NextResponse.json({
          success: true,
          alreadyActivated: true,
          plan: "premium",
          purchaseType: "property",
          propertyId: Number(propertyId),
          expiresAt,
        });
      }

      // ----------------------------------------------
      // EXISTING PRO PAYMENT
      // ----------------------------------------------

      const {
        data: paidSubscription,
        error: paidSubscriptionError,
      } = await supabaseAdmin
        .from("advertiser_subscriptions")
        .select(
          "id, user_id, expires_at, stripe_session_id"
        )
        .eq(
          "stripe_session_id",
          session.id
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (
        paidSubscriptionError ||
        !paidSubscription
      ) {
        console.error(
          "Existing Pro subscription lookup failed:",
          paidSubscriptionError
        );

        return NextResponse.json(
          {
            error:
              "Payment was confirmed, but the Pro subscription could not be verified.",
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json({
        success: true,
        alreadyActivated: true,
        plan: "pro",
        purchaseType: "account",
        subscriptionId:
          paidSubscription.id,
        expiresAt:
          paidSubscription.expires_at,
      });
    }

    // ==================================================
    // PREMIUM RECONCILIATION
    // ==================================================

    if (plan === "premium") {
      const propertyId = Number(
        metadata.propertyId
      );

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

      const {
        data: property,
        error: propertyError,
      } = await supabaseAdmin
        .from("properties")
        .select(
          "id, user_id, stripe_session_id, promotion_source, promotion_starts_at, promotion_expires_at"
        )
        .eq("id", propertyId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (propertyError) {
        console.error(
          "Premium property lookup failed:",
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

      /*
       * Only preserve promotion dates when the
       * webhook already activated THIS EXACT
       * Premium Stripe session.
       *
       * This prevents an older Premium or Pro
       * promotion from donating its dates to a
       * new R240 purchase.
       */

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
        const startsAt = new Date();

        const expiresAt = addDays(
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
        error: updateError,
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
        .eq("user_id", user.id)
        .select("id")
        .maybeSingle();

      if (
        updateError ||
        !updatedProperty
      ) {
        console.error(
          "Premium reconciliation failed:",
          updateError
        );

        return NextResponse.json(
          {
            error:
              "Payment was confirmed, but Premium could not be activated.",
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
          user_id: user.id,

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
         * The webhook may have inserted the same
         * UNIQUE Stripe session while this request
         * was running.
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
            user.id ||
          recoveredPayment.plan !==
            "premium" ||
          recoveredPayment.purchase_type !==
            "property" ||
          Number(
            recoveredPayment.property_id
          ) !== propertyId
        ) {
          console.error(
            "Premium payment recording failed:",
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
        success: true,
        alreadyActivated: false,
        plan: "premium",
        purchaseType: "property",
        propertyId,
        expiresAt: expiresIso,
      });
    }

    // ==================================================
    // PRO RECONCILIATION
    // ==================================================

    const initialPropertyId = Number(
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

    // ==================================================
    // VERIFY INITIAL PROPERTY
    // ==================================================

    const {
      data: initialProperty,
      error: initialPropertyError,
    } = await supabaseAdmin
      .from("properties")
      .select("id, user_id")
      .eq("id", initialPropertyId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (
      initialPropertyError ||
      !initialProperty
    ) {
      console.error(
        "Pro initial property lookup failed:",
        initialPropertyError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify the initial Pro property.",
        },
        {
          status:
            initialPropertyError
              ? 500
              : 403,
        }
      );
    }

    // ==================================================
    // FIND OR CREATE PRO SUBSCRIPTION
    // ==================================================

    let {
      data: proSubscription,
      error: proLookupError,
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

    if (proLookupError) {
      console.error(
        "Pro subscription lookup failed:",
        proLookupError
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
        user.id
    ) {
      return NextResponse.json(
        {
          error:
            "This Pro payment belongs to another account.",
        },
        {
          status: 403,
        }
      );
    }

    if (!proSubscription) {
      const startsAt = new Date();

      const expiresAt = addDays(
        startsAt,
        PROMOTION_DAYS
      );

      const {
        data: createdSubscription,
        error: createSubscriptionError,
      } = await supabaseAdmin
        .from(
          "advertiser_subscriptions"
        )
        .insert({
          user_id: user.id,

          plan: "pro",

          status: "active",

          listing_limit: 10,

          priority_listing_limit: 3,

          starts_at:
            startsAt.toISOString(),

          expires_at:
            expiresAt.toISOString(),

          stripe_session_id:
            session.id,

          stripe_payment_intent_id:
            paymentIntentId,

          amount_paid: PRO_PRICE,

          currency: "zar",
        })
        .select(
          "id, user_id, starts_at, expires_at, stripe_session_id"
        )
        .single();

      if (createSubscriptionError) {
        /*
         * The webhook may have created the
         * subscription while this browser
         * reconciliation was running.
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
            user.id
        ) {
          console.error(
            "Pro subscription creation failed:",
            createSubscriptionError
          );

          return NextResponse.json(
            {
              error:
                "Payment was confirmed, but Pro could not be activated.",
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

        promotion_source: "pro",

        promotion_starts_at:
          startsIso,

        promotion_expires_at:
          expiresIso,

        featured_until:
          expiresIso,
      })
      .eq("id", initialPropertyId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (
      proPropertyError ||
      !updatedProProperty
    ) {
      console.error(
        "Pro property reconciliation failed:",
        proPropertyError
      );

      return NextResponse.json(
        {
          error:
            "Pro is active, but the first property could not be promoted.",
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
      error: proPaymentInsertError,
    } = await supabaseAdmin
      .from("payments")
      .insert({
        user_id: user.id,

        /*
         * Pro is an ACCOUNT purchase.
         */
        property_id: null,

        plan: "pro",

        purchase_type: "account",

        amount: PRO_PRICE,

        currency: "zar",

        status: "paid",

        stripe_session_id:
          session.id,

        stripe_payment_intent_id:
          paymentIntentId,
      });

    if (proPaymentInsertError) {
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
          user.id ||
        recoveredPayment.plan !==
          "pro" ||
        recoveredPayment.purchase_type !==
          "account"
      ) {
        console.error(
          "Pro payment recording failed:",
          proPaymentInsertError
        );

        return NextResponse.json(
          {
            error:
              "Pro is active, but the payment record could not be confirmed.",
          },
          {
            status: 500,
          }
        );
      }
    }

    return NextResponse.json({
      success: true,

      alreadyActivated: false,

      plan: "pro",

      purchaseType: "account",

      subscriptionId:
        proSubscription.id,

      initialPropertyId,

      expiresAt: expiresIso,
    });
  } catch (error) {
    console.error(
      "Paid plan reconciliation error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to confirm payment and activate your HomeLinker plan.",
      },
      {
        status: 500,
      }
    );
  }
}