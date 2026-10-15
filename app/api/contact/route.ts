import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 30;
const MAX_MESSAGE_LENGTH = 5000;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
 * Basic in-memory rate limiting.
 *
 * This helps reduce simple repeated submissions to the same
 * running server instance.
 *
 * IMPORTANT:
 * Serverless instances do not share memory, so this is an
 * additional abuse-control layer rather than a perfect global
 * rate limiter.
 */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();

  const existing = rateLimitStore.get(ip);

  if (!existing || now >= existing.resetAt) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });

    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  existing.count += 1;
  rateLimitStore.set(ip, existing);

  return false;
}

export async function POST(req: Request) {
  try {
    /*
     * -------------------------------------------------------
     * BASIC REQUEST SIZE CHECK
     * -------------------------------------------------------
     */

    const contentLength = req.headers.get("content-length");

    if (contentLength) {
      const requestSize = Number(contentLength);

      if (
        Number.isFinite(requestSize) &&
        requestSize > 15_000
      ) {
        return NextResponse.json(
          {
            error: "Request is too large.",
          },
          {
            status: 413,
          }
        );
      }
    }

    /*
     * -------------------------------------------------------
     * RATE LIMIT
     * -------------------------------------------------------
     */

    const clientIp = getClientIp(req);

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          error:
            "Too many messages have been submitted. Please wait a few minutes and try again.",
        },
        {
          status: 429,
        }
      );
    }

    /*
     * -------------------------------------------------------
     * PARSE REQUEST
     * -------------------------------------------------------
     */

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request.",
        },
        {
          status: 400,
        }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          error: "Invalid request.",
        },
        {
          status: 400,
        }
      );
    }

    const requestBody = body as Record<string, unknown>;

    /*
     * -------------------------------------------------------
     * HONEYPOT
     * -------------------------------------------------------
     *
     * Real users never see or fill this field.
     *
     * Many basic bots automatically populate every field they
     * encounter. If this has a value, silently pretend the
     * submission succeeded.
     */

    const website =
      typeof requestBody.website === "string"
        ? requestBody.website.trim()
        : "";

    if (website) {
      return NextResponse.json({
        success: true,
      });
    }

    /*
     * -------------------------------------------------------
     * NORMALIZE VALUES
     * -------------------------------------------------------
     */

    const name =
      typeof requestBody.name === "string"
        ? requestBody.name.trim()
        : "";

    const email =
      typeof requestBody.email === "string"
        ? requestBody.email.trim().toLowerCase()
        : "";

    const phone =
      typeof requestBody.phone === "string"
        ? requestBody.phone.trim()
        : "";

    const message =
      typeof requestBody.message === "string"
        ? requestBody.message.trim()
        : "";

    /*
     * -------------------------------------------------------
     * SERVER-SIDE VALIDATION
     * -------------------------------------------------------
     */

    if (
      name.length < 2 ||
      name.length > MAX_NAME_LENGTH
    ) {
      return NextResponse.json(
        {
          error: "Please enter a valid name.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !emailRegex.test(email) ||
      email.length > MAX_EMAIL_LENGTH
    ) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    if (phone.length > MAX_PHONE_LENGTH) {
      return NextResponse.json(
        {
          error: "Please enter a valid phone number.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      message.length < 10 ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json(
        {
          error:
            "Your message must be between 10 and 5,000 characters.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * -------------------------------------------------------
     * SUPABASE SERVER CLIENT
     * -------------------------------------------------------
     *
     * Contact messages are now inserted ONLY from trusted
     * server-side code.
     */

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseServiceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error(
        "Contact API: missing Supabase environment variables."
      );

      return NextResponse.json(
        {
          error:
            "The contact service is temporarily unavailable.",
        },
        {
          status: 500,
        }
      );
    }

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
     * INSERT MESSAGE
     * -------------------------------------------------------
     *
     * We deliberately set status ourselves.
     *
     * The browser cannot choose the administrative status of
     * a contact message.
     */

    const { error } = await supabaseAdmin
      .from("contact_messages")
      .insert({
        name,
        email,
        phone: phone || null,
        message,
        status: "new",
      });

    if (error) {
      console.error(
        "Contact message insert error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Your message could not be sent right now. Please try again later.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Unexpected contact API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while sending your message.",
      },
      {
        status: 500,
      }
    );
  }
}