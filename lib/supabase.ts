import { createClient } from "@supabase/supabase-js";

function normalizeSupabaseUrl(url: string) {
  return url.trim().replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
}

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!rawSupabaseUrl || !rawSupabaseUrl.trim()) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL environment variable is required but was not provided.");
}

const rawSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!rawSupabaseAnonKey || !rawSupabaseAnonKey.trim()) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required but was not provided.");
}

const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl);
const supabaseAnonKey = rawSupabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);