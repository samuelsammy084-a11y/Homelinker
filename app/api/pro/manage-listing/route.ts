import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type ProAction =
  | "promote"
  | "unpromote"
  | "make_priority"
  | "remove_priority";

type PropertyPromotion = {
  id: number;
  user_id: string | null;
  status: string | null;
  plan: string | null;
  is_promoted: boolean | null;
  is_priority: boolean | null;
  promotion_source: string | null;
  promotion_starts_at: string | null;
  promotion_expires_at: string | null;
};

type ProSubscription = {
  id: string;
  user_id: string;
  status: string;
  listing_limit: number;
  priority_listing_limit: number;
  starts_at: string;
  expires_at: string;
};

function isFutureDate(
  value: string | null | undefined
) {
  if (!value) return false;

  const time = new Date(value).getTime();

  return (
    Number.isFinite(time) &&
    time > Date.now()
  );
}

function isActivePremium(
  property: PropertyPromotion
) {
  return (
    property.is_promoted === true &&
    property.promotion_source === "premium" &&
    isFutureDate(
      property.promotion_expires_at
    )
  );
}

function isActiveProPromotion(
  property: PropertyPromotion
) {
  return (
    property.status === "active" &&
    property.is_promoted === true &&
    property.promotion_source === "pro" &&
    isFutureDate(
      property.promotion_expires_at
    )
  );
}

export async function POST(
  request: NextRequest
) {
  try {
    // ============================================
    // ENVIRONMENT
    // ============================================

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabaseServiceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      !supabaseServiceRoleKey
    ) {
      console.error(
        "Pro management environment variables are missing."
      );

      return NextResponse.json(
        {
          error:
            "HomeLinker server configuration is incomplete.",
        },
        {
          status: 500,
        }
      );
    }

    // ============================================
    // AUTHENTICATION
    // ============================================

    const authorization =
      request.headers.get("authorization");

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          error:
            "You must be signed in to manage Pro listings.",
        },
        {
          status: 401,
        }
      );
    }

    const accessToken =
      authorization.slice(
        "Bearer ".length
      );

    const authClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error:
            "Your session has expired. Please sign in again.",
        },
        {
          status: 401,
        }
      );
    }

    // ============================================
    // REQUEST BODY
    // ============================================

    let body: {
      propertyId?: number | string;
      action?: ProAction;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error:
            "Invalid request body.",
        },
        {
          status: 400,
        }
      );
    }

    const propertyId =
      Number(body.propertyId);

    const action = body.action;

    const allowedActions: ProAction[] = [
      "promote",
      "unpromote",
      "make_priority",
      "remove_priority",
    ];

    if (
      !Number.isSafeInteger(propertyId) ||
      propertyId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "A valid property is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !action ||
      !allowedActions.includes(action)
    ) {
      return NextResponse.json(
        {
          error:
            "A valid Pro management action is required.",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================
    // TRUSTED DATABASE CLIENT
    // ============================================

    const admin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const nowIso =
      new Date().toISOString();

    // ============================================
    // ACTIVE PRO PACKAGE
    // ============================================

    const {
      data: subscriptionData,
      error: subscriptionError,
    } = await admin
      .from("advertiser_subscriptions")
      .select(`
        id,
        user_id,
        status,
        listing_limit,
        priority_listing_limit,
        starts_at,
        expires_at
      `)
      .eq("user_id", user.id)
      .eq("plan", "pro")
      .eq("status", "active")
      .gt("expires_at", nowIso)
      .order(
        "expires_at",
        {
          ascending: false,
        }
      )
      .limit(1)
      .maybeSingle();

    if (subscriptionError) {
      console.error(
        "Pro subscription lookup error:",
        subscriptionError
      );

      return NextResponse.json(
        {
          error:
            "Unable to check your Pro package.",
        },
        {
          status: 500,
        }
      );
    }

    if (!subscriptionData) {
      return NextResponse.json(
        {
          error:
            "You do not currently have an active HomeLinker Pro package.",
          code:
            "PRO_NOT_ACTIVE",
        },
        {
          status: 403,
        }
      );
    }

    const subscription =
      subscriptionData as ProSubscription;

    // ============================================
    // PROPERTY OWNERSHIP
    // ============================================

    const {
      data: propertyData,
      error: propertyError,
    } = await admin
      .from("properties")
      .select(`
        id,
        user_id,
        status,
        plan,
        is_promoted,
        is_priority,
        promotion_source,
        promotion_starts_at,
        promotion_expires_at
      `)
      .eq("id", propertyId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (propertyError) {
      console.error(
        "Pro property lookup error:",
        propertyError
      );

      return NextResponse.json(
        {
          error:
            "Unable to load this property.",
        },
        {
          status: 500,
        }
      );
    }

    if (!propertyData) {
      return NextResponse.json(
        {
          error:
            "This property could not be found or does not belong to you.",
        },
        {
          status: 404,
        }
      );
    }

    const property =
      propertyData as PropertyPromotion;

    // ============================================
    // ACTIVE STATUS REQUIRED
    // ============================================

    if (
      action === "promote" ||
      action === "make_priority"
    ) {
      if (property.status !== "active") {
        return NextResponse.json(
          {
            error:
              "Only active properties can receive Pro promotion.",
            code:
              "PROPERTY_NOT_ACTIVE",
          },
          {
            status: 409,
          }
        );
      }
    }

    // ============================================
    // CURRENT ACTIVE PRO USAGE
    //
    // IMPORTANT:
    // Only ACTIVE properties consume Pro slots.
    // Sold/rented properties are not counted
    // toward the 10 promoted-property limit.
    // ============================================

    const {
      data: promotedData,
      error: promotedError,
    } = await admin
      .from("properties")
      .select(`
        id,
        user_id,
        status,
        plan,
        is_promoted,
        is_priority,
        promotion_source,
        promotion_starts_at,
        promotion_expires_at
      `)
      .eq("user_id", user.id)
      .eq("status", "active")
      .eq("is_promoted", true)
      .eq(
        "promotion_source",
        "pro"
      )
      .gt(
        "promotion_expires_at",
        nowIso
      );

    if (promotedError) {
      console.error(
        "Pro promoted listings lookup error:",
        promotedError
      );

      return NextResponse.json(
        {
          error:
            "Unable to check your current Pro properties.",
        },
        {
          status: 500,
        }
      );
    }

    const activeProProperties =
      (promotedData ??
        []) as PropertyPromotion[];

    const promotedCount =
      activeProProperties.length;

    const priorityCount =
      activeProProperties.filter(
        (item) =>
          item.is_priority === true
      ).length;

    const propertyAlreadyPro =
      isActiveProPromotion(property);

    const propertyAlreadyPriority =
      propertyAlreadyPro &&
      property.is_priority === true;

    // ============================================
    // PROMOTE PROPERTY
    // ============================================

    if (action === "promote") {
      // Never overwrite an active separately
      // purchased Premium promotion.
      if (isActivePremium(property)) {
        return NextResponse.json(
          {
            error:
              "This property already has an active Premium promotion. HomeLinker will not replace a paid Premium promotion with Pro.",
            code:
              "ACTIVE_PREMIUM_PROTECTED",
          },
          {
            status: 409,
          }
        );
      }

      if (propertyAlreadyPro) {
        return NextResponse.json({
          success: true,

          alreadyPromoted: true,

          propertyId,

          isPromoted: true,

          isPriority:
            propertyAlreadyPriority,

          promotedCount,

          priorityCount,

          listingLimit:
            subscription.listing_limit,

          priorityListingLimit:
            subscription.priority_listing_limit,

          expiresAt:
            subscription.expires_at,
        });
      }

      if (
        promotedCount >=
        subscription.listing_limit
      ) {
        return NextResponse.json(
          {
            error:
              `Your Pro package allows up to ${subscription.listing_limit} active promoted properties. Remove one before promoting another.`,

            code:
              "PRO_LISTING_LIMIT_REACHED",

            promotedCount,

            listingLimit:
              subscription.listing_limit,
          },
          {
            status: 409,
          }
        );
      }

      const {
        error: promoteError,
      } = await admin
        .from("properties")
        .update({
          plan: "pro",

          is_promoted: true,

          is_priority: false,

          featured: true,

          promotion_source: "pro",

          promotion_starts_at:
            nowIso,

          promotion_expires_at:
            subscription.expires_at,

          featured_until:
            subscription.expires_at,
        })
        .eq("id", propertyId)
        .eq("user_id", user.id)
        .eq("status", "active");

      if (promoteError) {
        console.error(
          "Pro promote property error:",
          promoteError
        );

        return NextResponse.json(
          {
            error:
              "Unable to promote this property.",
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json({
        success: true,

        action: "promote",

        propertyId,

        isPromoted: true,

        isPriority: false,

        promotedCount:
          promotedCount + 1,

        priorityCount,

        listingLimit:
          subscription.listing_limit,

        priorityListingLimit:
          subscription.priority_listing_limit,

        expiresAt:
          subscription.expires_at,
      });
    }

    // ============================================
    // REMOVE PRO PROMOTION
    // ============================================

    if (action === "unpromote") {
      if (!propertyAlreadyPro) {
        return NextResponse.json({
          success: true,

          alreadyUnpromoted: true,

          propertyId,

          isPromoted:
            property.is_promoted === true &&
            isFutureDate(
              property.promotion_expires_at
            ),

          isPriority: false,

          promotedCount,

          priorityCount,

          listingLimit:
            subscription.listing_limit,

          priorityListingLimit:
            subscription.priority_listing_limit,

          expiresAt:
            subscription.expires_at,
        });
      }

      const wasPriority =
        property.is_priority === true;

      const {
        error: unpromoteError,
      } = await admin
        .from("properties")
        .update({
          plan: "free",

          is_promoted: false,

          is_priority: false,

          featured: false,

          promotion_source: null,

          promotion_starts_at: null,

          promotion_expires_at: null,

          featured_until: null,
        })
        .eq("id", propertyId)
        .eq("user_id", user.id)
        .eq(
          "promotion_source",
          "pro"
        );

      if (unpromoteError) {
        console.error(
          "Pro unpromote property error:",
          unpromoteError
        );

        return NextResponse.json(
          {
            error:
              "Unable to remove Pro promotion from this property.",
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json({
        success: true,

        action: "unpromote",

        propertyId,

        isPromoted: false,

        isPriority: false,

        promotedCount:
          Math.max(
            0,
            promotedCount - 1
          ),

        priorityCount:
          Math.max(
            0,
            priorityCount -
              (wasPriority ? 1 : 0)
          ),

        listingLimit:
          subscription.listing_limit,

        priorityListingLimit:
          subscription.priority_listing_limit,

        expiresAt:
          subscription.expires_at,
      });
    }

    // ============================================
    // MAKE PRIORITY PROPERTY
    // ============================================

    if (action === "make_priority") {
      if (isActivePremium(property)) {
        return NextResponse.json(
          {
            error:
              "This property currently has a separate Premium promotion. Only properties using your Pro package can become Pro Priority Properties.",

            code:
              "ACTIVE_PREMIUM_PROTECTED",
          },
          {
            status: 409,
          }
        );
      }

      if (!propertyAlreadyPro) {
        return NextResponse.json(
          {
            error:
              "Promote this property with Pro before making it a Priority Property.",

            code:
              "PROPERTY_NOT_PRO_PROMOTED",
          },
          {
            status: 409,
          }
        );
      }

      if (propertyAlreadyPriority) {
        return NextResponse.json({
          success: true,

          alreadyPriority: true,

          propertyId,

          isPromoted: true,

          isPriority: true,

          promotedCount,

          priorityCount,

          listingLimit:
            subscription.listing_limit,

          priorityListingLimit:
            subscription.priority_listing_limit,

          expiresAt:
            subscription.expires_at,
        });
      }

      if (
        priorityCount >=
        subscription.priority_listing_limit
      ) {
        return NextResponse.json(
          {
            error:
              `Your Pro package allows up to ${subscription.priority_listing_limit} Priority Properties. Remove one before choosing another.`,

            code:
              "PRO_PRIORITY_LIMIT_REACHED",

            priorityCount,

            priorityListingLimit:
              subscription.priority_listing_limit,
          },
          {
            status: 409,
          }
        );
      }

      const {
        error: priorityError,
      } = await admin
        .from("properties")
        .update({
          is_priority: true,
          featured: true,
        })
        .eq("id", propertyId)
        .eq("user_id", user.id)
        .eq("status", "active")
        .eq(
          "promotion_source",
          "pro"
        )
        .eq(
          "is_promoted",
          true
        )
        .gt(
          "promotion_expires_at",
          nowIso
        );

      if (priorityError) {
        console.error(
          "Pro priority property error:",
          priorityError
        );

        return NextResponse.json(
          {
            error:
              "Unable to make this a Priority Property.",
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json({
        success: true,

        action:
          "make_priority",

        propertyId,

        isPromoted: true,

        isPriority: true,

        promotedCount,

        priorityCount:
          priorityCount + 1,

        listingLimit:
          subscription.listing_limit,

        priorityListingLimit:
          subscription.priority_listing_limit,

        expiresAt:
          subscription.expires_at,
      });
    }

    // ============================================
    // REMOVE PRIORITY STATUS
    // ============================================

    if (
      action === "remove_priority"
    ) {
      if (!propertyAlreadyPro) {
        return NextResponse.json(
          {
            error:
              "This property is not currently using your Pro promotion.",

            code:
              "PROPERTY_NOT_PRO_PROMOTED",
          },
          {
            status: 409,
          }
        );
      }

      if (!propertyAlreadyPriority) {
        return NextResponse.json({
          success: true,

          alreadyRemoved: true,

          propertyId,

          isPromoted: true,

          isPriority: false,

          promotedCount,

          priorityCount,

          listingLimit:
            subscription.listing_limit,

          priorityListingLimit:
            subscription.priority_listing_limit,

          expiresAt:
            subscription.expires_at,
        });
      }

      const {
        error: removePriorityError,
      } = await admin
        .from("properties")
        .update({
          is_priority: false,
        })
        .eq("id", propertyId)
        .eq("user_id", user.id)
        .eq(
          "promotion_source",
          "pro"
        );

      if (removePriorityError) {
        console.error(
          "Remove Pro priority error:",
          removePriorityError
        );

        return NextResponse.json(
          {
            error:
              "Unable to remove Priority status from this property.",
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json({
        success: true,

        action:
          "remove_priority",

        propertyId,

        isPromoted: true,

        isPriority: false,

        promotedCount,

        priorityCount:
          Math.max(
            0,
            priorityCount - 1
          ),

        listingLimit:
          subscription.listing_limit,

        priorityListingLimit:
          subscription.priority_listing_limit,

        expiresAt:
          subscription.expires_at,
      });
    }

    // ============================================
    // FALLBACK
    // ============================================

    return NextResponse.json(
      {
        error:
          "Unsupported Pro action.",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error(
      "HomeLinker Pro management error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong managing your Pro property.",
      },
      {
        status: 500,
      }
    );
  }
}