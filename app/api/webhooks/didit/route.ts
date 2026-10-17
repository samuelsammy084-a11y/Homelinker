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

function safeCompareHex(
  expected: string,
  received: string
): boolean {
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
  /*
   * JSON.parse already converts JSON numbers such as
   * 1.0 to the JavaScript number 1. JSON.stringify
   * therefore produces the compact numeric form needed
   * when recreating the canonical payload.
   */
  const canonical = JSON.stringify(sortKeys(payload));

  const expectedSignature = createHmac("sha256", secret)
    .update(canonical, "utf8")
    .digest("hex");

  return safeCompareHex(
    expectedSignature,
    receivedSignature
  );
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
    const secret =
      process.env.DIDIT_WEBHOOK_SECRET;

    const workflowId =
      process.env.DIDIT_WORKFLOW_ID;

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
      console.error(
        "Didit webhook configuration missing."
      );

      return NextResponse.json(
        { error: "Webhook unavailable" },
        { status: 503 }
      );
    }

    /*
     * Keep the original request body available before
     * parsing it. Do not log it because KYC webhooks can
     * contain sensitive identity information.
     */
    const rawBody = await request.text();

    if (
      Buffer.byteLength(rawBody, "utf8") >
      512_000
    ) {
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
        {
          error:
            "Missing webhook authentication",
        },
        { status: 401 }
      );
    }

    const timestamp = Number(timestampHeader);

    if (
      !Number.isSafeInteger(timestamp) ||
      Math.abs(
        Math.floor(Date.now() / 1000) -
          timestamp
      ) > 300
    ) {
      return NextResponse.json(
        { error: "Invalid webhook timestamp" },
        { status: 401 }
      );
    }

    let payload: DiditPayload;

    try {
      payload = JSON.parse(
        rawBody
      ) as DiditPayload;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    /*
     * Verify the signed canonical V2 payload before
     * trusting any fields inside it.
     */
    if (
      !verifySignatureV2(
        payload,
        signature,
        secret
      )
    ) {
      console.error(
        "Didit webhook signature verification failed."
      );

      return NextResponse.json(
        {
          error:
            "Invalid webhook signature",
        },
        { status: 401 }
      );
    }

    if (
      !Number.isSafeInteger(
        payload.timestamp
      ) ||
      payload.timestamp !== timestamp
    ) {
      return NextResponse.json(
        {
          error:
            "Webhook timestamp mismatch",
        },
        { status: 401 }
      );
    }

    /*
     * HomeLinker only processes KYC status updates.
     */
    if (
      payload.webhook_type !==
      "status.updated"
    ) {
      return NextResponse.json({
        received: true,
      });
    }

    /*
     * Sandbox results must never verify a real
     * HomeLinker account.
     */
    if (payload.environment !== "live") {
      return NextResponse.json({
        received: true,
      });
    }

    /*
     * HomeLinker advertiser verification is
     * individual KYC, not business/KYB.
     */
    if (
      payload.session_kind === "business" ||
      payload.business_session_id
    ) {
      return NextResponse.json({
        received: true,
      });
    }

    /*
     * Only process our configured HomeLinker workflow.
     */
    if (
      payload.workflow_id !== workflowId
    ) {
      return NextResponse.json({
        received: true,
      });
    }

    if (
      typeof payload.session_id !==
        "string" ||
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
        {
          error:
            "Missing verification status",
        },
        { status: 400 }
      );
    }

    const mappedStatus = mapStatus(
      payload.status
    );

    /*
     * A new/unknown Didit status must never
     * accidentally verify a user.
     */
    if (mappedStatus === null) {
      console.warn(
        "Ignoring unknown Didit verification status:",
        payload.status
      );

      return NextResponse.json({
        received: true,
      });
    }

    if (mappedStatus === "ignore") {
      return NextResponse.json({
        received: true,
      });
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
     * provider_session_id is the authoritative mapping
     * between a Didit verification and a HomeLinker
     * user.
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
      .eq(
        "provider_session_id",
        payload.session_id
      )
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
       * A webhook can theoretically arrive before
       * /api/verification/start has finished inserting
       * the local session record. A retry can repair
       * that race.
       */
      return NextResponse.json(
        {
          error:
            "Verification session not registered",
        },
        { status: 503 }
      );
    }

    /*
     * vendor_data is only a secondary consistency
     * check. We never use it as the primary mapping.
     */
    if (
      typeof payload.vendor_data ===
        "string" &&
      payload.vendor_data !==
        verification.user_id
    ) {
      console.error(
        "Didit vendor_data does not match stored user."
      );

      return NextResponse.json(
        {
          error:
            "Verification user mismatch",
        },
        { status: 400 }
      );
    }

    /*
     * Once this particular session is approved,
     * reordered older non-approved events must not
     * downgrade it.
     *
     * Notice that an APPROVED retry is NOT returned
     * early. We intentionally continue so the profile
     * can be reconciled if an earlier profile update
     * failed.
     */
    if (
      verification.status ===
        "approved" &&
      mappedStatus !== "approved"
    ) {
      return NextResponse.json({
        received: true,
      });
    }

    /*
     * Determine whether another newer approved
     * verification exists. An older session must
     * never revoke a newer successful verification.
     */
    const {
      data: newerApprovedSessions,
      error: newerApprovalError,
    } = await admin
      .from("identity_verifications")
      .select("id")
      .eq(
        "user_id",
        verification.user_id
      )
      .eq("provider", "didit")
      .eq("status", "approved")
      .gt(
        "created_at",
        verification.created_at
      )
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

    const hasNewerApproval =
      Boolean(
        newerApprovedSessions &&
          newerApprovedSessions.length > 0
      );

    const now =
      new Date().toISOString();

    const terminal =
      mappedStatus === "approved" ||
      mappedStatus === "declined" ||
      mappedStatus === "expired" ||
      mappedStatus === "cancelled";

    /*
     * Only rewrite the verification row when its
     * status actually changed.
     *
     * Duplicate events still continue into profile
     * reconciliation below.
     */
    if (
      verification.status !== mappedStatus
    ) {
      const {
        error:
          verificationUpdateError,
      } = await admin
        .from("identity_verifications")
        .update({
          status: mappedStatus,
          updated_at: now,
          completed_at: terminal
            ? now
            : null,
        })
        .eq("id", verification.id);

      if (verificationUpdateError) {
        console.error(
          "Failed updating identity verification."
        );

        return NextResponse.json(
          {
            error:
              "Verification update failed",
          },
          { status: 500 }
        );
      }
    }

    /*
     * If this is an older session and a newer approved
     * verification exists, recording this session is
     * enough. It must not alter the user's profile.
     */
    if (hasNewerApproval) {
      return NextResponse.json({
        received: true,
      });
    }

    if (mappedStatus === "approved") {
      /*
       * Reconcile the profile even when this webhook
       * is a duplicate Approved event.
       *
       * This is what repairs a partial failure where
       * identity_verifications was updated successfully
       * but profiles failed to update.
       */
      const {
        error: profileUpdateError,
      } = await admin
        .from("profiles")
        .update({
          is_verified: true,
          verification_status:
            "verified",
          verified_at: now,
          updated_at: now,
        })
        .eq("id", verification.user_id);

      if (profileUpdateError) {
        console.error(
          "Failed marking profile as verified."
        );

        return NextResponse.json(
          {
            error:
              "Profile update failed",
          },
          { status: 500 }
        );
      }

      /*
       * The verification notification is no longer
       * actionable after approval. Mark it read rather
       * than deleting the user's notification history.
       */
      const {
        error:
          notificationUpdateError,
      } = await admin
        .from("notifications")
        .update({
          is_read: true,
        })
        .eq(
          "user_id",
          verification.user_id
        )
        .eq("type", "verification")
        .eq("action_url", "/verify");

      if (notificationUpdateError) {
        /*
         * Notification cleanup is not security
         * critical. Do not fail an otherwise successful
         * verification because of it.
         */
        console.error(
          "Failed marking verification notification as read."
        );
      }
    } else {
      /*
       * Before making the profile unverified, check
       * whether ANY Didit session for this user is
       * already approved.
       */
      const {
        data: approvedSessions,
        error: approvedSessionError,
      } = await admin
        .from("identity_verifications")
        .select("id")
        .eq(
          "user_id",
          verification.user_id
        )
        .eq("provider", "didit")
        .eq("status", "approved")
        .limit(1);

      if (approvedSessionError) {
        console.error(
          "Failed checking approved verification sessions."
        );

        return NextResponse.json(
          { error: "Database error" },
          { status: 500 }
        );
      }

      const hasApprovedSession =
        Boolean(
          approvedSessions &&
            approvedSessions.length > 0
        );

      if (!hasApprovedSession) {
        const profileStatus =
          mappedStatus === "in_progress"
            ? "pending"
            : mappedStatus;

        /*
         * Duplicate non-approved events also reconcile
         * the profile. This means a temporary profile
         * update failure can be repaired on retry.
         */
        const {
          error: profileUpdateError,
        } = await admin
          .from("profiles")
          .update({
            is_verified: false,
            verification_status:
              profileStatus,
            verified_at: null,
            updated_at: now,
          })
          .eq("id", verification.user_id);

        if (profileUpdateError) {
          console.error(
            "Failed updating profile verification status."
          );

          return NextResponse.json(
            {
              error:
                "Profile update failed",
            },
            { status: 500 }
          );
        }
      }
    }

    /*
     * We deliberately do NOT store payload.decision.
     * It can contain ID numbers, dates of birth,
     * document images, addresses and other sensitive
     * KYC information.
     */
    return NextResponse.json({
      received: true,
    });
  } catch {
    console.error(
      "Unhandled Didit webhook error."
    );

    return NextResponse.json(
      {
        error:
          "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}