import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type CreateListingBody = {
  listing_type?: unknown;
  property_type?: unknown;
  title?: unknown;
  description?: unknown;
  province?: unknown;
  city?: unknown;
  suburb?: unknown;
  street_address?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  price?: unknown;
  bedrooms?: unknown;
  bathrooms?: unknown;
  parking?: unknown;
  deposit?: unknown;
  available_from?: unknown;
  floor_size?: unknown;
  land_size?: unknown;
  condition?: unknown;
  rates?: unknown;
  levies?: unknown;
  furnished?: unknown;
  pet_friendly?: unknown;
  image_url?: unknown;
  image_urls?: unknown;
  contact_phone?: unknown;
};

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function optionalString(value: unknown): string | null {
  const cleaned = cleanString(value);
  return cleaned || null;
}

function optionalNumber(value: unknown): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

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
        "Create listing: required Supabase environment variables are missing."
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
        "Create listing authentication error:",
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
    // REQUIRE ADVERTISER IDENTITY VERIFICATION
    // --------------------------------------------------
    //
    // Home seekers do NOT need verification.
    //
    // Identity verification is required only when a user
    // attempts to advertise a property.
    //
    // This check happens server-side so it cannot be
    // bypassed by calling this API directly.

    const {
      data: profile,
      error: profileError,
    } = await admin
      .from("profiles")
      .select("is_verified, verification_status")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error(
        "Create listing profile verification error:",
        profileError
      );

      return NextResponse.json(
        {
          error:
            "We could not check your identity verification status.",
        },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        {
          error:
            "Your HomeLinker profile could not be found.",
          code: "PROFILE_NOT_FOUND",
        },
        { status: 403 }
      );
    }

    const identityVerified =
      profile.is_verified === true &&
      profile.verification_status === "verified";

    if (!identityVerified) {
      return NextResponse.json(
        {
          error:
            "Identity verification is required before you can post a property.",
          code: "IDENTITY_VERIFICATION_REQUIRED",
          verificationStatus:
            profile.verification_status ?? "unverified",
          verificationUrl: "/verify",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // READ REQUEST
    // --------------------------------------------------

    let body: CreateListingBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const listingType =
      cleanString(body.listing_type).toLowerCase();

    const propertyType =
      cleanString(body.property_type);

    const title = cleanString(body.title);

    const description =
      cleanString(body.description);

    const province =
      cleanString(body.province);

    const city = cleanString(body.city);

    const suburb = cleanString(body.suburb);

    const streetAddress =
      cleanString(body.street_address);

    const contactPhone =
      cleanString(body.contact_phone);

    const price = Number(body.price);

    // --------------------------------------------------
    // SERVER-SIDE VALIDATION
    // --------------------------------------------------

    if (
      listingType !== "rent" &&
      listingType !== "sale"
    ) {
      return NextResponse.json(
        {
          error:
            "Listing type must be rent or sale.",
        },
        { status: 400 }
      );
    }

    if (!propertyType) {
      return NextResponse.json(
        { error: "Property type is required." },
        { status: 400 }
      );
    }

    if (
      title.length < 5 ||
      title.length > 150
    ) {
      return NextResponse.json(
        {
          error:
            "Property title must be between 5 and 150 characters.",
        },
        { status: 400 }
      );
    }

    if (description.length > 5000) {
      return NextResponse.json(
        {
          error:
            "Property description is too long.",
        },
        { status: 400 }
      );
    }

    if (!province || !city) {
      return NextResponse.json(
        {
          error:
            "Province and city are required.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      price > 1_000_000_000
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid property price.",
        },
        { status: 400 }
      );
    }

    const imageUrls = Array.isArray(
      body.image_urls
    )
      ? body.image_urls.filter(
          (url): url is string =>
            typeof url === "string" &&
            url.trim().length > 0
        )
      : [];

    if (
      imageUrls.length === 0 ||
      imageUrls.length > 20
    ) {
      return NextResponse.json(
        {
          error:
            "A property must have between 1 and 20 photos.",
        },
        { status: 400 }
      );
    }

    const imageUrl =
      cleanString(body.image_url) ||
      imageUrls[0];

    // --------------------------------------------------
    // CREATE AS PENDING
    // --------------------------------------------------
    //
    // At this point:
    //
    // 1. The user is authenticated.
    // 2. Their identity is verified.
    // 3. Their listing data has been validated.
    //
    // The browser is deliberately NOT allowed to choose
    // status, plan, payment_status, featured, verified
    // or promotion fields.
    //
    // Every new listing remains private until a plan is
    // selected and the appropriate trusted activation
    // process succeeds.

    const {
      data: insertedProperty,
      error: insertError,
    } = await admin
      .from("properties")
      .insert({
        user_id: user.id,

        listing_type: listingType,
        property_type: propertyType,

        title,
        description,

        province,
        city,
        suburb,
        street_address: streetAddress,

        latitude: optionalNumber(
          body.latitude
        ),

        longitude: optionalNumber(
          body.longitude
        ),

        price,

        bedrooms: optionalNumber(
          body.bedrooms
        ),

        bathrooms: optionalNumber(
          body.bathrooms
        ),

        parking: optionalNumber(
          body.parking
        ),

        deposit: optionalNumber(
          body.deposit
        ),

        available_from: optionalString(
          body.available_from
        ),

        floor_size: optionalNumber(
          body.floor_size
        ),

        land_size: optionalNumber(
          body.land_size
        ),

        condition: optionalString(
          body.condition
        ),

        rates: optionalNumber(
          body.rates
        ),

        levies: optionalNumber(
          body.levies
        ),

        furnished:
          typeof body.furnished === "boolean"
            ? body.furnished
            : false,

        pet_friendly:
          typeof body.pet_friendly === "boolean"
            ? body.pet_friendly
            : false,

        image_url: imageUrl,
        image_urls: imageUrls,

        contact_phone:
          contactPhone || null,

        show_contact_phone: false,

        // Privileged fields controlled here.
        status: "pending",
        plan: "free",
        payment_status: "free",
        featured: false,
        is_promoted: false,
      })
      .select("id, status")
      .single();

    if (insertError) {
      console.error(
        "Create listing database error:",
        insertError
      );

      // PostgreSQL unique violation.
      if (insertError.code === "23505") {
        return NextResponse.json(
          {
            error:
              "This property appears to already be listed. Please check your dashboard.",
            code: "DUPLICATE_LISTING",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error:
            "Your property could not be created.",
        },
        { status: 500 }
      );
    }

    if (!insertedProperty) {
      return NextResponse.json(
        {
          error:
            "Your property could not be created.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        propertyId: insertedProperty.id,
        status: insertedProperty.status,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Unexpected create listing error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something unexpected happened while creating your listing.",
      },
      { status: 500 }
    );
  }
}