import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("q") ?? "";

  if (!search) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("properties")
    .select("city, province")
    .ilike("city", `%${search}%`);

  if (error) {
    return NextResponse.json([]);
  }

  const unique = Array.from(
    new Map(
      data.map((item) => [
        `${item.city}-${item.province}`,
        item,
      ])
    ).values()
  );

  return NextResponse.json(unique);
}