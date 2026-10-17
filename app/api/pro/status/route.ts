import {
  NextRequest,
  NextResponse,
} from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type ProProperty = {
  id: number;
  status: string | null;
  is_promoted: boolean | null;
  is_priority: boolean | null;
  promotion_source: string | null;
  promotion_starts_at: string | null;
  promotion_expires_at: string | null;
};

export async function GET(
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
        "Pro status environment variables are missing."
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
            "You must be signed in to view your Pro status.",
        },
        {
          status: 401,
        }
      );
    }

    const accessToken =
      authorization.slice("Bearer ".length);

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
      data: subscription,
      error: subscriptionError,
    } = await admin
      .from("advertiser_subscriptions")
      .select(`
        id,
        plan,
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
      .order("expires_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (subscriptionError) {
      console.error(
        "Pro status subscription error:",
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

    // ============================================
    // NO ACTIVE PRO PACKAGE
    // ============================================

    if (!subscription) {
      return NextResponse.json({
        success: true,

        pro: {
          active: false,

          subscriptionId: null,

          startsAt: null,

          expiresAt: null,

          listingLimit: 10,

          priorityListingLimit: 3,

          promotedCount: 0,

          priorityCount: 0,

          remainingPromotedSlots: 0,

          remainingPrioritySlots: 0,

          promotedPropertyIds: [],

          priorityPropertyIds: [],
        },
      });
    }

    // ============================================
    // ACTIVE PRO PROPERTIES
    //
    // Only ACTIVE properties consume package slots.
    // Sold/rented listings are intentionally excluded.
    // ============================================

    const {
      data: propertyData,
      error: propertyError,
    } = await admin
      .from("properties")
      .select(`
        id,
        status,
        is_promoted,
        is_priority,
        promotion_source,
        promotion_starts_at,
        promotion_expires_at
      `)
      .eq("user_id", user.id)
      .eq("status", "active")
      .eq("is_promoted", true)
      .eq("promotion_source", "pro")
      .gt(
        "promotion_expires_at",
        nowIso
      );

    if (propertyError) {
      console.error(
        "Pro status properties error:",
        propertyError
      );

      return NextResponse.json(
        {
          error:
            "Unable to load your Pro properties.",
        },
        {
          status: 500,
        }
      );
    }

    const proProperties =
      (propertyData ?? []) as ProProperty[];

    // ============================================
    // VALIDATE AGAINST SUBSCRIPTION EXPIRY
    //
    // A Pro property should never extend beyond
    // the package that granted the promotion.
    // ============================================

    const subscriptionExpiry =
      new Date(
        subscription.expires_at
      ).getTime();

    const activeProperties =
      proProperties.filter((property) => {
        if (
          property.status !== "active" ||
          !property.promotion_expires_at
        ) {
          return false;
        }

        const propertyExpiry =
          new Date(
            property.promotion_expires_at
          ).getTime();

        return (
          Number.isFinite(propertyExpiry) &&
          propertyExpiry > Date.now() &&
          propertyExpiry <=
            subscriptionExpiry
        );
      });

    // ============================================
    // COUNTS
    // ============================================

    const promotedPropertyIds =
      activeProperties.map(
        (property) => property.id
      );

    const priorityPropertyIds =
      activeProperties
        .filter(
          (property) =>
            property.is_priority === true
        )
        .map(
          (property) => property.id
        );

    const promotedCount =
      promotedPropertyIds.length;

    const priorityCount =
      priorityPropertyIds.length;

    const listingLimit =
      Number(subscription.listing_limit);

    const priorityListingLimit =
      Number(
        subscription.priority_listing_limit
      );

    const remainingPromotedSlots =
      Math.max(
        0,
        listingLimit - promotedCount
      );

    const remainingPrioritySlots =
      Math.max(
        0,
        priorityListingLimit -
          priorityCount
      );

    // ============================================
    // RESPONSE
    // ============================================

    return NextResponse.json({
      success: true,

      pro: {
        active: true,

        subscriptionId:
          subscription.id,

        startsAt:
          subscription.starts_at,

        expiresAt:
          subscription.expires_at,

        listingLimit,

        priorityListingLimit,

        promotedCount,

        priorityCount,

        remainingPromotedSlots,

        remainingPrioritySlots,

        promotedPropertyIds,

        priorityPropertyIds,
      },
    });
  } catch (error) {
    console.error(
      "HomeLinker Pro status error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong checking your Pro package.",
      },
      {
        status: 500,
      }
    );
  }
}