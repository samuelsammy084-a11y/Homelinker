import { supabase } from "./supabase";

export async function getProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*");

  if (error) {
    console.log("========== SUPABASE ERROR ==========");
    console.log(JSON.stringify(error, null, 2));
    console.log("====================================");
    return [];
  }

  return data ?? [];
}