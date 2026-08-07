import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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