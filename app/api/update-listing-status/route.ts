import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const ALLOWED_STATUSES = ["active", "sold", "rented"] as const;

type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabaseServiceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      !supabaseServiceRoleKey
    ) {
      console.error("Missing Supabase environment variables.");

      return NextResponse.json(
        {
          error: "Database service is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * -------------------------------------------------------
     * AUTHENTICATION
     * -------------------------------------------------------
     *
     * The browser must send the authenticated user's
     * Supabase access token.
     *
     * We validate that token before using the service-role
     * client for any privileged database operation.
     */

    const authorization = req.headers.get("authorization");

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

    /*
     * Normal Supabase client.
     *
     * Used only to validate the access token and identify
     * the authenticated user.
     */

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
    } = await supabaseAuth.auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Your session is invalid or has expired.",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * Server-only privileged client.
     *
     * IMPORTANT:
     *
     * The service-role key bypasses Row Level Security.
     * Therefore every privileged operation below must
     * perform its own ownership and transition checks.
     *
     * Never expose SUPABASE_SERVICE_ROLE_KEY to a
     * client component.
     */

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

    /*
     * -------------------------------------------------------
     * REQUEST VALIDATION
     * -------------------------------------------------------
     */

    let body: unknown;

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

    const requestBody =
      body && typeof body === "object"
        ? (body as Record<string, unknown>)
        : {};

    const propertyId = Number(requestBody.propertyId);

    const requestedStatus =
      typeof requestBody.status === "string"
        ? requestBody.status.trim().toLowerCase()
        : "";

    if (!Number.isInteger(propertyId) || propertyId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid property ID.",
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
          error: "Invalid listing status.",
        },
        {
          status: 400,
        }
      );
    }

    const newStatus = requestedStatus as AllowedStatus;

    /*
     * -------------------------------------------------------
     * LOAD PROPERTY
     * -------------------------------------------------------
     *
     * Because the admin client bypasses RLS, ownership must
     * be verified manually before anything is updated.
     */

    const {
      data: property,
      error: propertyError,
    } = await supabaseAdmin
      .from("properties")
      .select(
        "id, title, user_id, listing_type, status"
      )
      .eq("id", propertyId)
      .maybeSingle();

    if (propertyError) {
      console.error(
        "Property ownership lookup error:",
        propertyError
      );

      return NextResponse.json(
        {
          error: "Unable to verify the property.",
        },
        {
          status: 500,
        }
      );
    }

    if (!property) {
      return NextResponse.json(
        {
          error: "Property not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * -------------------------------------------------------
     * OWNERSHIP CHECK
     * -------------------------------------------------------
     */

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
        ? property.status.trim().toLowerCase()
        : "";

    /*
     * -------------------------------------------------------
     * PROTECT LISTING ACTIVATION
     * -------------------------------------------------------
     *
     * CRITICAL SECURITY RULE:
     *
     * A pending listing must NEVER become active through
     * this generic status endpoint.
     *
     * Initial activation must happen through the dedicated
     * activation routes:
     *
     * FREE:
     * /api/activate-free-listing
     *
     * PAID:
     * Stripe checkout / webhook / paid activation flow
     *
     * This prevents a user from bypassing HomeLinker's
     * listing/pricing flow by directly calling this API with:
     *
     * {
     *   propertyId: 123,
     *   status: "active"
     * }
     */

    if (oldStatus === "pending" && newStatus === "active") {
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

    /*
     * We also reject attempts to mark a pending listing as
     * sold or rented.
     *
     * A listing should first be legitimately activated
     * before it can be marked unavailable.
     */

    if (
      oldStatus === "pending" &&
      (newStatus === "sold" || newStatus === "rented")
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

    /*
     * -------------------------------------------------------
     * LISTING TYPE / STATUS CONSISTENCY
     * -------------------------------------------------------
     *
     * Sale listings:
     *
     * active -> sold
     * sold   -> active
     *
     * Rental listings:
     *
     * active -> rented
     * rented -> active
     */

    const listingType =
      typeof property.listing_type === "string"
        ? property.listing_type.trim().toLowerCase()
        : "";

    const isSale = listingType === "sale";

    if (newStatus === "sold" && !isSale) {
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

    if (newStatus === "rented" && isSale) {
      return NextResponse.json(
        {
          error:
            "Sale listings cannot be marked as rented.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * -------------------------------------------------------
     * EXPLICIT STATUS TRANSITION RULES
     * -------------------------------------------------------
     *
     * Rather than trusting any combination of allowed
     * status values, explicitly define which transitions
     * this endpoint is permitted to perform.
     */

    const validTransition =
      (oldStatus === "active" &&
        ((isSale && newStatus === "sold") ||
          (!isSale && newStatus === "rented"))) ||
      (oldStatus === "sold" &&
        isSale &&
        newStatus === "active") ||
      (oldStatus === "rented" &&
        !isSale &&
        newStatus === "active");

    /*
     * Same status is harmless and should not create
     * duplicate notifications.
     */

    if (oldStatus === newStatus) {
      return NextResponse.json({
        success: true,
        propertyId,
        status: newStatus,
        notificationsCreated: 0,
      });
    }

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

    /*
     * -------------------------------------------------------
     * UPDATE PROPERTY
     * -------------------------------------------------------
     *
     * Defense in depth:
     *
     * We filter by:
     *
     * - property ID
     * - authenticated owner ID
     * - OLD status
     *
     * Including the old status reduces the chance of an
     * unexpected concurrent request changing a listing
     * from a state we did not validate.
     */

    const {
      data: updatedProperty,
      error: updateError,
    } = await supabaseAdmin
      .from("properties")
      .update({
        status: newStatus,
      })
      .eq("id", propertyId)
      .eq("user_id", user.id)
      .eq("status", oldStatus)
      .select("id, status")
      .maybeSingle();

    if (updateError) {
      console.error(
        "Property status update error:",
        updateError
      );

      return NextResponse.json(
        {
          error: "Unable to update the listing status.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * If nothing was updated, the property's status may
     * have changed between our initial read and update.
     */

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

    let notificationsCreated = 0;

    /*
     * -------------------------------------------------------
     * FAVORITE NOTIFICATIONS
     * -------------------------------------------------------
     *
     * Notify users who saved the property when it becomes
     * unavailable.
     *
     * We intentionally do NOT notify everyone when an owner
     * reactivates a sold/rented listing.
     */

    if (newStatus === "sold" || newStatus === "rented") {
      const {
        data: favoriteRows,
        error: favoritesError,
      } = await supabaseAdmin
        .from("favorites")
        .select("user_id")
        .eq("property_id", propertyId);

      if (favoritesError) {
        /*
         * The property status update already succeeded.
         * Notification failure must not undo it.
         */

        console.error(
          "Favorites lookup error:",
          favoritesError
        );
      } else {
        const favoriterIds = Array.from(
          new Set(
            (favoriteRows ?? [])
              .map((row) => row.user_id)
              .filter(
                (userId): userId is string =>
                  typeof userId === "string" &&
                  userId.length > 0 &&
                  userId !== user.id
              )
          )
        );

        if (favoriterIds.length > 0) {
          const statusLabel =
            newStatus === "sold" ? "sold" : "rented";

          const notificationRows = favoriterIds.map(
            (userId) => ({
              user_id: userId,

              title: `A saved property was marked as ${statusLabel}`,

              message: `"${property.title}" has been marked as ${statusLabel} by the owner.`,

              type: "listing_status",

              is_read: false,

              listing_id: String(propertyId),
            })
          );

          const {
            error: notificationError,
          } = await supabaseAdmin
            .from("notifications")
            .insert(notificationRows);

          if (notificationError) {
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
    });
  } catch (error) {
    console.error(
      "Update listing status error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to update the listing status.",
      },
      {
        status: 500,
      }
    );
  }
}