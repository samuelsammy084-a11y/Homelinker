import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type DeleteListingBody = {
  propertyId?: unknown;
};

export async function DELETE(request: Request) {
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
        "Delete listing: required Supabase environment variables are missing."
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
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const accessToken = authorization
      .slice("Bearer ".length)
      .trim();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required." },
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
        "Delete listing authentication error:",
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

    let body: DeleteListingBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const propertyId = Number(body.propertyId);

    if (
      !Number.isSafeInteger(propertyId) ||
      propertyId <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid property ID." },
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
    // VERIFY OWNERSHIP
    // --------------------------------------------------
    //
    // Service role bypasses RLS, so ownership MUST be
    // checked manually before deletion.

    const {
      data: property,
      error: propertyError,
    } = await admin
      .from("properties")
      .select("id, user_id")
      .eq("id", propertyId)
      .maybeSingle();

    if (propertyError) {
      console.error(
        "Delete listing lookup error:",
        propertyError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify this property.",
        },
        { status: 500 }
      );
    }

    if (!property) {
      return NextResponse.json(
        {
          error:
            "Property not found.",
        },
        { status: 404 }
      );
    }

    if (property.user_id !== user.id) {
      return NextResponse.json(
        {
          error:
            "You are not allowed to delete this property.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // DELETE PROPERTY
    // --------------------------------------------------
    //
    // Include user_id again as defence in depth even
    // though ownership was already verified above.

    const {
      data: deletedProperty,
      error: deleteError,
    } = await admin
      .from("properties")
      .delete()
      .eq("id", propertyId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (deleteError) {
      console.error(
        "Delete listing database error:",
        deleteError
      );

      return NextResponse.json(
        {
          error:
            "The property could not be deleted.",
        },
        { status: 500 }
      );
    }

    if (!deletedProperty) {
      return NextResponse.json(
        {
          error:
            "The property was not deleted.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      propertyId: deletedProperty.id,
    });
  } catch (error) {
    console.error(
      "Unexpected delete listing error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something unexpected happened while deleting your property.",
      },
      { status: 500 }
    );
  }
}