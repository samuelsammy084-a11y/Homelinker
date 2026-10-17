import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const ALLOWED_STATUSES = [
  "active",
  "sold",
  "rented",
] as const;

type AllowedStatus =
  (typeof ALLOWED_STATUSES)[number];

type PropertyRecord = {
  id: number;
  title: string;
  user_id: string | null;
  listing_type: string | null;
  status: string | null;

  plan: string | null;

  is_promoted: boolean | null;
  is_priority: boolean | null;

  promotion_source: string | null;
  promotion_starts_at: string | null;
  promotion_expires_at: string | null;
};

function isFutureDate(
  value: string | null | undefined
): boolean {
  if (!value) {
    return false;
  }

  const time = new Date(value).getTime();

  return (
    Number.isFinite(time) &&
    time > Date.now()
  );
}

function hasCurrentProEntitlement(
  property: PropertyRecord
): boolean {
  return (
    property.is_promoted === true &&
    property.promotion_source === "pro" &&
    isFutureDate(
      property.promotion_expires_at
    )
  );
}

export async function POST(req: Request) {
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
        "Missing Supabase environment variables."
      );

      return NextResponse.json(
        {
          error:
            "Database service is not configured.",
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
      req.headers.get("authorization");

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          error:
            "Authentication required.",
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
          error:
            "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    const supabaseAuth = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } =
      await supabaseAuth.auth.getUser(
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

    // ============================================
    // ADMIN CLIENT
    // ============================================

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

    // ============================================
    // REQUEST
    // ============================================

    let body: unknown;

    try {
      body = await req.json();
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

    const requestBody =
      body &&
      typeof body === "object"
        ? (body as Record<
            string,
            unknown
          >)
        : {};

    const propertyId = Number(
      requestBody.propertyId
    );

    const requestedStatus =
      typeof requestBody.status === "string"
        ? requestBody.status
            .trim()
            .toLowerCase()
        : "";

    if (
      !Number.isSafeInteger(propertyId) ||
      propertyId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid property ID.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_STATUSES.includes(
        requestedStatus as AllowedStatus
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid listing status.",
        },
        {
          status: 400,
        }
      );
    }

    const newStatus =
      requestedStatus as AllowedStatus;

    // ============================================
    // PROPERTY
    // ============================================

    const {
      data: propertyData,
      error: propertyError,
    } = await supabaseAdmin
      .from("properties")
      .select(`
        id,
        title,
        user_id,
        listing_type,
        status,
        plan,
        is_promoted,
        is_priority,
        promotion_source,
        promotion_starts_at,
        promotion_expires_at
      `)
      .eq("id", propertyId)
      .maybeSingle();

    if (propertyError) {
      console.error(
        "Property ownership lookup error:",
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

    if (!propertyData) {
      return NextResponse.json(
        {
          error:
            "Property not found.",
        },
        {
          status: 404,
        }
      );
    }

    const property =
      propertyData as PropertyRecord;

    // ============================================
    // OWNERSHIP
    // ============================================

    if (property.user_id !== user.id) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to update this property.",
        },
        {
          status: 403,
        }
      );
    }

    const oldStatus =
      typeof property.status === "string"
        ? property.status
            .trim()
            .toLowerCase()
        : "";

    // ============================================
    // PENDING PROTECTION
    // ============================================

    if (
      oldStatus === "pending" &&
      newStatus === "active"
    ) {
      return NextResponse.json(
        {
          error:
            "Pending listings must be activated through the listing activation process.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      oldStatus === "pending" &&
      (newStatus === "sold" ||
        newStatus === "rented")
    ) {
      return NextResponse.json(
        {
          error:
            "A pending listing cannot be marked as sold or rented.",
        },
        {
          status: 403,
        }
      );
    }

    // ============================================
    // LISTING TYPE
    // ============================================

    const listingType =
      typeof property.listing_type ===
      "string"
        ? property.listing_type
            .trim()
            .toLowerCase()
        : "";

    const isSale =
      listingType === "sale" ||
      listingType === "for sale";

    const isRental =
      listingType === "rent" ||
      listingType === "for rent";

    if (
      newStatus === "sold" &&
      !isSale
    ) {
      return NextResponse.json(
        {
          error:
            "Only sale listings can be marked as sold.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      newStatus === "rented" &&
      !isRental
    ) {
      return NextResponse.json(
        {
          error:
            "Only rental listings can be marked as rented.",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================
    // SAME STATUS
    // ============================================

    if (oldStatus === newStatus) {
      return NextResponse.json({
        success: true,
        propertyId,
        status: newStatus,
        notificationsCreated: 0,
        proPromotionReleased: false,
      });
    }

    // ============================================
    // ALLOWED TRANSITIONS
    // ============================================

    const validTransition =
      (oldStatus === "active" &&
        isSale &&
        newStatus === "sold") ||
      (oldStatus === "active" &&
        isRental &&
        newStatus === "rented") ||
      (oldStatus === "sold" &&
        isSale &&
        newStatus === "active") ||
      (oldStatus === "rented" &&
        isRental &&
        newStatus === "active");

    if (!validTransition) {
      return NextResponse.json(
        {
          error:
            "That listing status change is not allowed.",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================
    // PRO SLOT RELEASE
    // ============================================
    //
    // If an ACTIVE Pro-promoted listing becomes
    // sold/rented, remove its Pro assignment.
    //
    // This means:
    //
    // - it immediately stops receiving Pro ranking
    // - it stops being a Priority Property
    // - it frees one of the advertiser's 10 slots
    // - it frees one of the 3 Priority slots
    //
    // Reactivating it later does NOT secretly
    // restore the old Pro promotion.
    //
    // The advertiser can deliberately promote it
    // again through /api/pro/manage-listing, where
    // the normal limits are checked.
    //
    // Premium is intentionally NOT cleared here.
    // Premium is a separate one-property purchase.
    // Public ranking/badges already require status
    // === "active", so an unavailable Premium
    // property receives no public paid placement.
    // ============================================

    const becomingUnavailable =
      newStatus === "sold" ||
      newStatus === "rented";

    const releaseProPromotion =
      becomingUnavailable &&
      hasCurrentProEntitlement(
        property
      );

    const updatePayload: Record<
      string,
      unknown
    > = {
      status: newStatus,
    };

    if (releaseProPromotion) {
      updatePayload.plan = "free";
      updatePayload.is_promoted = false;
      updatePayload.is_priority = false;
      updatePayload.featured = false;
      updatePayload.promotion_source =
        null;
      updatePayload.promotion_starts_at =
        null;
      updatePayload.promotion_expires_at =
        null;
      updatePayload.featured_until = null;
    }

    // ============================================
    // UPDATE
    // ============================================

    const {
      data: updatedProperty,
      error: updateError,
    } = await supabaseAdmin
      .from("properties")
      .update(updatePayload)
      .eq("id", propertyId)
      .eq("user_id", user.id)
      .eq("status", oldStatus)
      .select(`
        id,
        status,
        plan,
        is_promoted,
        is_priority,
        promotion_source,
        promotion_expires_at
      `)
      .maybeSingle();

    if (updateError) {
      console.error(
        "Property status update error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Unable to update the listing status.",
        },
        {
          status: 500,
        }
      );
    }

    if (!updatedProperty) {
      return NextResponse.json(
        {
          error:
            "The listing changed before this request completed. Please refresh and try again.",
        },
        {
          status: 409,
        }
      );
    }

    // ============================================
    // FAVORITE NOTIFICATIONS
    // ============================================

    let notificationsCreated = 0;

    if (becomingUnavailable) {
      const {
        data: favoriteRows,
        error: favoritesError,
      } = await supabaseAdmin
        .from("favorites")
        .select("user_id")
        .eq(
          "property_id",
          propertyId
        );

      if (favoritesError) {
        console.error(
          "Favorites lookup error:",
          favoritesError
        );
      } else {
        const favoriterIds =
          Array.from(
            new Set(
              (favoriteRows ?? [])
                .map(
                  (row) =>
                    row.user_id
                )
                .filter(
                  (
                    userId
                  ): userId is string =>
                    typeof userId ===
                      "string" &&
                    userId.length > 0 &&
                    userId !== user.id
                )
            )
          );

        if (
          favoriterIds.length > 0
        ) {
          const statusLabel =
            newStatus === "sold"
              ? "sold"
              : "rented";

          const notificationRows =
            favoriterIds.map(
              (userId) => ({
                user_id: userId,

                title:
                  `A saved property was marked as ${statusLabel}`,

                message:
                  `"${property.title}" has been marked as ${statusLabel} by the owner.`,

                type:
                  "listing_status",

                is_read: false,

                listing_id:
                  String(propertyId),
              })
            );

          const {
            error:
              notificationError,
          } = await supabaseAdmin
            .from("notifications")
            .insert(
              notificationRows
            );

          if (
            notificationError
          ) {
            console.error(
              "Notification insert error:",
              notificationError
            );
          } else {
            notificationsCreated =
              notificationRows.length;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,

      propertyId,

      status: newStatus,

      notificationsCreated,

      proPromotionReleased:
        releaseProPromotion,

      isPromoted:
        updatedProperty.is_promoted ===
        true,

      isPriority:
        updatedProperty.is_priority ===
        true,
    });
  } catch (error) {
    console.error(
      "Update listing status error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to update the listing status.",
      },
      {
        status: 500,
      }
    );
  }
}