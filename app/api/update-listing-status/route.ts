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

export async function POST(req: Request) {
  try {
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

    /*
     * Read the authenticated user's access token.
     *
     * The browser sends this token to the API.
     * We validate it before allowing any privileged
     * service-role operation.
     */
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

    /*
     * Normal Supabase client.
     *
     * This client is used only to validate the
     * access token and identify the user.
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
    } = await supabaseAuth.auth.getUser(
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

    /*
     * Server-only privileged client.
     *
     * SUPABASE_SERVICE_ROLE_KEY must NEVER be
     * exposed to client components.
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

    const body = await req.json();

    const propertyId = Number(
      body?.propertyId
    );

    const requestedStatus =
      typeof body?.status === "string"
        ? body.status.trim().toLowerCase()
        : "";

    if (
      !Number.isInteger(propertyId) ||
      propertyId <= 0
    ) {
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

    const newStatus =
      requestedStatus as AllowedStatus;

    /*
     * The admin client bypasses RLS.
     *
     * Therefore ownership MUST be checked manually
     * before performing the privileged update.
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
          error: "Property not found.",
        },
        {
          status: 404,
        }
      );
    }

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

    /*
     * Keep statuses consistent:
     *
     * sale   -> active / sold
     * rental -> active / rented
     */
    const isSale =
      property.listing_type === "sale";

    if (
      (newStatus === "sold" && !isSale) ||
      (newStatus === "rented" && isSale)
    ) {
      return NextResponse.json(
        {
          error:
            "That status is not valid for this listing.",
        },
        {
          status: 400,
        }
      );
    }

    const oldStatus =
      typeof property.status === "string"
        ? property.status
        : null;

    /*
     * Avoid unnecessary updates and duplicate
     * notifications.
     */
    if (oldStatus === newStatus) {
      return NextResponse.json({
        success: true,
        propertyId,
        status: newStatus,
        notificationsCreated: 0,
      });
    }

    /*
     * Update only the authenticated user's property.
     *
     * We still include user_id in the update filter
     * as defense-in-depth.
     */
    const { error: updateError } =
      await supabaseAdmin
        .from("properties")
        .update({
          status: newStatus,
        })
        .eq("id", propertyId)
        .eq("user_id", user.id);

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

    let notificationsCreated = 0;

    /*
     * Notify users only when the property becomes
     * unavailable.
     *
     * We don't notify everyone when the owner
     * changes it back to active.
     */
    if (
      newStatus === "sold" ||
      newStatus === "rented"
    ) {
      const {
        data: favoriteRows,
        error: favoritesError,
      } = await supabaseAdmin
        .from("favorites")
        .select("user_id")
        .eq("property_id", propertyId);

      if (favoritesError) {
        /*
         * The status update already succeeded.
         * Notification failure should not undo it.
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
            newStatus === "sold"
              ? "sold"
              : "rented";

          const notificationRows =
            favoriterIds.map((userId) => ({
              user_id: userId,

              title:
                `A saved property was marked as ${statusLabel}`,

              message:
                `"${property.title}" has been marked as ${statusLabel} by the owner.`,

              type: "listing_status",

              is_read: false,

              listing_id:
                String(propertyId),
            }));

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
        error:
          "Unable to update the listing status.",
      },
      {
        status: 500,
      }
    );
  }
}