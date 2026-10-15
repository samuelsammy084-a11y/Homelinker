import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const DIDIT_API_URL =
  "https://verification.didit.me/v3/session/";

type DiditSessionResponse = {
  session_id?: string;
  url?: string;
  status?: string;
};

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    const diditApiKey =
      process.env.DIDIT_API_KEY;

    const diditWorkflowId =
      process.env.DIDIT_WORKFLOW_ID;

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      !supabaseServiceKey ||
      !diditApiKey ||
      !diditWorkflowId
    ) {
      console.error(
        "Missing verification environment variables"
      );

      return NextResponse.json(
        {
          error: "Verification service is not configured.",
        },
        { status: 503 }
      );
    }

    // ---------------------------------------
    // 1. Authenticate the HomeLinker user
    // ---------------------------------------

    const authorization =
      request.headers.get("authorization") ?? "";

    const token = authorization.startsWith("Bearer ")
      ? authorization.slice(7).trim()
      : "";

    if (!token) {
      return NextResponse.json(
        { error: "Please log in first." },
        { status: 401 }
      );
    }

    const supabase = createClient(
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
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        {
          error:
            "Your session has expired. Please log in again.",
        },
        { status: 401 }
      );
    }

    // ---------------------------------------
    // 2. Create trusted server client
    // ---------------------------------------

    const admin = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // ---------------------------------------
    // 3. Check existing verification status
    // ---------------------------------------

    const {
      data: profile,
      error: profileError,
    } = await admin
      .from("profiles")
      .select("is_verified")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error(
        "Profile lookup failed:",
        profileError.message
      );

      return NextResponse.json(
        {
          error:
            "Unable to check your verification status.",
        },
        { status: 500 }
      );
    }

    if (profile?.is_verified === true) {
      return NextResponse.json(
        {
          error: "Your account is already verified.",
        },
        { status: 409 }
      );
    }

    // ---------------------------------------
    // 4. Check for an existing active session
    // ---------------------------------------

    const {
      data: existingVerification,
      error: existingError,
    } = await admin
      .from("identity_verifications")
      .select("id, status, created_at")
      .eq("user_id", user.id)
      .in("status", ["pending", "in_progress"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingError) {
      console.error(
        "Verification lookup failed:",
        existingError.message
      );

      return NextResponse.json(
        {
          error:
            "Unable to check existing verification sessions.",
        },
        { status: 500 }
      );
    }

    // Prevent repeatedly creating sessions within 30 minutes.
    // This is a basic safeguard, not a replacement for
    // distributed rate limiting.
    if (existingVerification) {
      const createdAt = new Date(
        existingVerification.created_at
      ).getTime();

      const thirtyMinutes = 30 * 60 * 1000;

      if (
        Number.isFinite(createdAt) &&
        Date.now() - createdAt < thirtyMinutes
      ) {
        return NextResponse.json(
          {
            error:
              "You already started verification recently. Please wait before starting another session.",
          },
          { status: 429 }
        );
      }
    }

    // ---------------------------------------
    // 5. Create verification session with Didit
    // ---------------------------------------

    const diditResponse = await fetch(
      DIDIT_API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": diditApiKey,
        },
        body: JSON.stringify({
          workflow_id: diditWorkflowId,
          vendor_data: user.id,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!diditResponse.ok) {
      console.error(
        "Didit session creation failed:",
        diditResponse.status
      );

      return NextResponse.json(
        {
          error:
            "Unable to start identity verification. Please try again.",
        },
        { status: 502 }
      );
    }

    const diditData: DiditSessionResponse =
      await diditResponse.json().catch(() => ({}));

    const sessionId = diditData.session_id;
    const sessionUrl = diditData.url;

    if (
      typeof sessionId !== "string" ||
      !sessionId.trim() ||
      typeof sessionUrl !== "string" ||
      !sessionUrl.trim()
    ) {
      console.error(
        "Didit returned an incomplete session response"
      );

      return NextResponse.json(
        {
          error:
            "Verification provider returned an invalid response.",
        },
        { status: 502 }
      );
    }

    // ---------------------------------------
    // 6. Validate verification URL
    // ---------------------------------------

    let verificationUrl: URL;

    try {
      verificationUrl = new URL(sessionUrl);
    } catch {
      return NextResponse.json(
        {
          error: "Invalid verification URL.",
        },
        { status: 502 }
      );
    }

    if (
      verificationUrl.protocol !== "https:" ||
      verificationUrl.hostname !== "verify.didit.me"
    ) {
      console.error(
        "Didit returned an untrusted verification URL"
      );

      return NextResponse.json(
        {
          error: "Untrusted verification URL.",
        },
        { status: 502 }
      );
    }

    // ---------------------------------------
    // 7. Record session in HomeLinker
    // ---------------------------------------

    const {
      error: insertError,
    } = await admin
      .from("identity_verifications")
      .insert({
        user_id: user.id,
        provider: "didit",
        provider_session_id: sessionId,
        status: "pending",
      });

    if (insertError) {
      console.error(
        "Failed to save verification session:",
        insertError.message
      );

      // Never return an untracked verification link.
      return NextResponse.json(
        {
          error:
            "Verification could not be recorded. Please try again later.",
        },
        { status: 500 }
      );
    }

    // ---------------------------------------
    // 8. Return hosted verification URL
    // ---------------------------------------

    return NextResponse.json({
      success: true,
      verificationUrl: verificationUrl.toString(),
    });
  } catch (error) {
    console.error(
      "Verification start failed:",
      error instanceof Error
        ? error.name
        : "Unknown error"
    );

    return NextResponse.json(
      {
        error:
          "Unable to start verification right now.",
      },
      { status: 500 }
    );
  }
}