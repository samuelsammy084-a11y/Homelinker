import { NextResponse } from "next/server";
import { authReturnPath } from "@/lib/auth-return-path";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = authReturnPath(url.searchParams.get("next"));

  if (code) {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("code", code);
    loginUrl.searchParams.set("next", next);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
