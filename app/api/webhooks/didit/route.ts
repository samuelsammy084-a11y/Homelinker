import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type DiditPayload = {
  event_id?: string;
  webhook_type?: string;
  timestamp?: number;
  created_at?: number;
  application_id?: string;
  environment?: "live" | "sandbox";
  session_id?: string;
  business_session_id?: string;
  session_kind?: string;
  status?: string;
  workflow_id?: string;
  workflow_version?: number;
  vendor_data?: string;
  sandbox_scenario?: string | null;
};

type VerificationStatus =
  | "pending"
  | "in_progress"
  | "approved"
  | "declined"
  | "expired"
  | "cancelled";

function shortenFloats(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(shortenFloats);
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(
        ([key, item]) => [key, shortenFloats(item)]
      )
    );
  }

  if (
    typeof value === "number" &&
    !Number.isInteger(value) &&
    value % 1 === 0
  ) {
    return Math.trunc(value);
  }

  return value;
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }

  if (value !== null && typeof value === "object") {
    const object = value as Record<string, unknown>;

    return Object.keys(object)
      .sort()
      .reduce<Record<string, unknown>>((result, key) => {
        result[key] = sortKeys(object[key]);
        return result;
      }, {});
  }

  return value;
}

function safeCompareHex(expected: string, received: string): boolean {
  if (
    !/^[a-f0-9]{64}$/i.test(expected) ||
    !/^[a-f0-9]{64}$/i.test(received)
  ) {
    return false;
  }

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(received, "hex");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

function verifySignatureV2(
  payload: unknown,
  receivedSignature: string,
  secret: string
): boolean {
  const canonical = JSON.stringify(
    sortKeys(shortenFloats(payload))
  );

  const expectedSignature = createHmac("sha256", secret)
    .update(canonical, "utf8")
    .digest("hex");

  return safeCompareHex(expectedSignature, receivedSignature);
}

function mapStatus(
  status: string
): VerificationStatus | "ignore" | null {
  switch (status) {
    case "Approved":
      return "approved";

    case "Declined":
      return "declined";

    case "In Review":
    case "In Progress":
    case "Resubmitted":
      return "in_progress";

    case "Not Started":
      return "pending";

    case "Abandoned":
    case "Expired":
    case "Kyc Expired":
      return "expired";

    case "Awaiting User":
      return "ignore";

    default:
      return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.DIDIT_WEBHOOK_SECRET;
    const workflowId = process.env.DIDIT_WORKFLOW_ID;

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (
      !secret ||
      !workflowId ||
      !supabaseUrl ||
      !serviceRoleKey
    ) {
      console.error("Didit webhook configuration missing.");

      return NextResponse.json(
        { error: "Webhook unavailable" },
        { status: 503 }
      );
    }

    /*
     * Read the raw request body first.
     * Do not use request.json() before obtaining it.
     */
    const rawBody = await request.text();

    if (Buffer.byteLength(rawBody, "utf8") > 512_000) {
      return NextResponse.json(
        { error: "Payload too large" },
        { status: 413 }
      );
    }

    const timestampHeader =
      request.headers.get("x-timestamp");

    const signature =
      request.headers.get("x-signature-v2");

    if (!timestampHeader || !signature) {
      return NextResponse.json(
        { error: "Missing webhook authentication" },
        { status: 401 }
      );
    }

    const timestamp = Number(timestampHeader);

    if (
      !Number.isSafeInteger(timestamp) ||
      Math.abs(Math.floor(Date.now() / 1000) - timestamp) > 300
    ) {
      return NextResponse.json(
        { error: "Invalid webhook timestamp" },
        { status: 401 }
      );
    }

    let payload: DiditPayload;

    try {
      payload = JSON.parse(rawBody) as DiditPayload;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    /*
     * Verify Didit's V2 HMAC before trusting anything
     * contained in the webhook.
     */
    if (!verifySignatureV2(payload, signature, secret)) {
      console.error("Didit webhook signature verification failed.");

      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    /*
     * X-Timestamp and payload.timestamp should describe
     * the same dispatch.
     */
    if (
      !Number.isSafeInteger(payload.timestamp) ||
      payload.timestamp !== timestamp
    ) {
      return NextResponse.json(
        { error: "Webhook timestamp mismatch" },
        { status: 401 }
      );
    }

    /*
     * HomeLinker currently subscribes only to KYC
     * status.updated events.
     */
    if (payload.webhook_type !== "status.updated") {
      return NextResponse.json({ received: true });
    }

    /*
     * Do not process sandbox events as real verification.
     */
    if (payload.environment !== "live") {
      return NextResponse.json({ received: true });
    }

    /*
     * HomeLinker advertiser verification is KYC,
     * not business/KYB verification.
     */
    if (
      payload.session_kind === "business" ||
      payload.business_session_id
    ) {
      return NextResponse.json({ received: true });
    }

    /*
     * Only accept results belonging to our configured
     * HomeLinker KYC workflow.
     */
    if (payload.workflow_id !== workflowId) {
      return NextResponse.json({ received: true });
    }

    if (
      typeof payload.session_id !== "string" ||
      payload.session_id.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing session ID" },
        { status: 400 }
      );
    }

    if (
      typeof payload.status !== "string" ||
      payload.status.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing verification status" },
        { status: 400 }
      );
    }

    const mappedStatus = mapStatus(payload.status);

    /*
     * Unknown future Didit statuses must never
     * accidentally verify somebody.
     */
    if (mappedStatus === null) {
      console.warn(
        "Ignoring unknown Didit verification status:",
        payload.status
      );

      return NextResponse.json({ received: true });
    }

    if (mappedStatus === "ignore") {
      return NextResponse.json({ received: true });
    }

    const admin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    /*
     * The session ID stored when HomeLinker created
     * the Didit session is the authoritative user mapping.
     *
     * We do NOT trust vendor_data by itself.
     */
    const {
      data: verification,
      error: verificationLookupError,
    } = await admin
      .from("identity_verifications")
      .select(
        "id, user_id, status, created_at, completed_at"
      )
      .eq("provider", "didit")
      .eq("provider_session_id", payload.session_id)
      .maybeSingle();

    if (verificationLookupError) {
      console.error(
        "Failed to find identity verification."
      );

      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      );
    }

    if (!verification) {
      /*
       * Returning 503 allows Didit to retry if the
       * webhook happened to arrive before our session
       * record was committed.
       */
      return NextResponse.json(
        { error: "Verification session not registered" },
        { status: 503 }
      );
    }

    /*
     * vendor_data is a secondary consistency check.
     * The actual mapping is provider_session_id above.
     */
    if (
      typeof payload.vendor_data === "string" &&
      payload.vendor_data !== verification.user_id
    ) {
      console.error(
        "Didit vendor_data does not match stored user."
      );

      return NextResponse.json(
        { error: "Verification user mismatch" },
        { status: 400 }
      );
    }

    /*
     * Idempotency:
     * receiving the same status again must be harmless.
     */
    if (verification.status === mappedStatus) {
      return NextResponse.json({ received: true });
    }

    /*
     * Once a particular session has been approved,
     * an older/reordered non-approved event for that
     * same session must not revoke it.
     */
    if (
      verification.status === "approved" &&
      mappedStatus !== "approved"
    ) {
      return NextResponse.json({ received: true });
    }

    /*
     * If the user has a newer approved session,
     * this older session may be recorded but must not
     * revoke the user's verified profile.
     */
    const {
      data: newerApprovedSessions,
      error: newerApprovalError,
    } = await admin
      .from("identity_verifications")
      .select("id")
      .eq("user_id", verification.user_id)
      .eq("provider", "didit")
      .eq("status", "approved")
      .gt("created_at", verification.created_at)
      .limit(1);

    if (newerApprovalError) {
      console.error(
        "Failed checking newer verification sessions."
      );

      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      );
    }

    const now = new Date().toISOString();

    const terminal =
      mappedStatus === "approved" ||
      mappedStatus === "declined" ||
      mappedStatus === "expired" ||
      mappedStatus === "cancelled";

    const { error: verificationUpdateError } =
      await admin
        .from("identity_verifications")
        .update({
          status: mappedStatus,
          updated_at: now,
          completed_at: terminal ? now : null,
        })
        .eq("id", verification.id);

    if (verificationUpdateError) {
      console.error(
        "Failed updating identity verification."
      );

      return NextResponse.json(
        { error: "Verification update failed" },
        { status: 500 }
      );
    }

    /*
     * An older failed/expired session cannot undo a
     * successful newer verification.
     */
    if (
      newerApprovedSessions &&
      newerApprovedSessions.length > 0
    ) {
      return NextResponse.json({ received: true });
    }

    if (mappedStatus === "approved") {
      const { error: profileUpdateError } = await admin
        .from("profiles")
        .update({
          is_verified: true,
          verification_status: "verified",
          verified_at: now,
        })
        .eq("id", verification.user_id);

      if (profileUpdateError) {
        console.error(
          "Failed marking profile as verified."
        );

        return NextResponse.json(
          { error: "Profile update failed" },
          { status: 500 }
        );
      }
    } else {
      /*
       * Only change the profile to an unverified state
       * if it isn't already verified by another session.
       */
      const {
        data: anyApprovedSession,
        error: approvedSessionError,
      } = await admin
        .from("identity_verifications")
        .select("id")
        .eq("user_id", verification.user_id)
        .eq("provider", "didit")
        .eq("status", "approved")
        .limit(1);

      if (approvedSessionError) {
        return NextResponse.json(
          { error: "Database error" },
          { status: 500 }
        );
      }

      if (
        !anyApprovedSession ||
        anyApprovedSession.length === 0
      ) {
        const profileStatus =
          mappedStatus === "in_progress"
            ? "pending"
            : mappedStatus;

        const { error: profileUpdateError } =
          await admin
            .from("profiles")
            .update({
              is_verified: false,
              verification_status: profileStatus,
              verified_at: null,
            })
            .eq("id", verification.user_id);

        if (profileUpdateError) {
          console.error(
            "Failed updating profile verification status."
          );

          return NextResponse.json(
            { error: "Profile update failed" },
            { status: 500 }
          );
        }
      }
    }

    /*
     * We deliberately do NOT store payload.decision.
     * It can contain ID numbers, DOB, images,
     * addresses and other sensitive KYC information.
     */
    return NextResponse.json({
      received: true,
    });
  } catch {
    console.error("Unhandled Didit webhook error.");

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}