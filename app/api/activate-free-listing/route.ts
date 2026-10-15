import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type ActivateFreeListingBody = {
  propertyId?: unknown;
};

export async function POST(request: Request) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      !serviceRoleKey
    ) {
      console.error(
        "Activate free listing: required Supabase environment variables are missing."
      );

      return NextResponse.json(
        {
          error:
            "Listing service is temporarily unavailable.",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // AUTHENTICATE USER
    // --------------------------------------------------

    const authorization =
      request.headers.get("authorization");

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        { status: 401 }
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
        { status: 401 }
      );
    }

    const authClient = createClient(
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
      error: userError,
    } = await authClient.auth.getUser(accessToken);

    if (userError || !user) {
      console.error(
        "Activate free listing authentication error:",
        userError
      );

      return NextResponse.json(
        {
          error:
            "Your login session is invalid or has expired. Please sign in again.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------
    // READ REQUEST
    // --------------------------------------------------

    let body: ActivateFreeListingBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const propertyId = Number(body.propertyId);

    if (
      !Number.isInteger(propertyId) ||
      propertyId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid property ID.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // TRUSTED DATABASE CLIENT
    // --------------------------------------------------

    const admin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // --------------------------------------------------
    // FIND PROPERTY + VERIFY OWNERSHIP
    // --------------------------------------------------

    const {
      data: property,
      error: propertyError,
    } = await admin
      .from("properties")
      .select(
        "id, user_id, status, plan, payment_status"
      )
      .eq("id", propertyId)
      .maybeSingle();

    if (propertyError) {
      console.error(
        "Activate free listing property lookup error:",
        propertyError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify the property.",
        },
        { status: 500 }
      );
    }

    if (!property) {
      return NextResponse.json(
        {
          error: "Property not found.",
        },
        { status: 404 }
      );
    }

    if (property.user_id !== user.id) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to activate this property.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // HANDLE ALREADY-ACTIVE FREE LISTING
    // --------------------------------------------------

    if (
      property.status === "active" &&
      property.plan === "free" &&
      property.payment_status === "free"
    ) {
      return NextResponse.json({
        success: true,
        propertyId,
        status: "active",
        plan: "free",
        alreadyActive: true,
      });
    }

    // --------------------------------------------------
    // ONLY PENDING LISTINGS CAN SELECT FREE
    // --------------------------------------------------

    if (property.status !== "pending") {
      return NextResponse.json(
        {
          error:
            "This listing cannot be activated with the free plan.",
        },
        { status: 409 }
      );
    }

    // --------------------------------------------------
    // ACTIVATE FREE LISTING
    // --------------------------------------------------
    //
    // This privileged update happens only on the server.
    // The browser cannot directly choose these fields.

    const {
      data: activatedProperty,
      error: updateError,
    } = await admin
      .from("properties")
      .update({
        status: "active",
        plan: "free",
        payment_status: "free",
        featured: false,
        is_promoted: false,
      })
      .eq("id", propertyId)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .select("id, status, plan, payment_status")
      .maybeSingle();

    if (updateError) {
      console.error(
        "Activate free listing database error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Your listing could not be activated.",
        },
        { status: 500 }
      );
    }

    if (!activatedProperty) {
      return NextResponse.json(
        {
          error:
            "The listing could not be activated. Please refresh and try again.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        propertyId: activatedProperty.id,
        status: activatedProperty.status,
        plan: activatedProperty.plan,
        paymentStatus:
          activatedProperty.payment_status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Unexpected activate free listing error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something unexpected happened while activating your listing.",
      },
      { status: 500 }
    );
  }
}