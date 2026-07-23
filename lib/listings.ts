import { supabase } from "./supabase";

export async function uploadImages(images: File[]) {
  const imageUrls: string[] = [];

  for (const image of images) {
    const fileName = `${Date.now()}-${Math.random()}-${image.name}`;

    const { error } = await supabase.storage
      .from("property-images")
      .upload(fileName, image);

    if (error) throw error;

    const { data } = supabase.storage
      .from("property-images")
      .getPublicUrl(fileName);

    imageUrls.push(data.publicUrl);
  }

  return imageUrls;
}

export async function createDraftListing(data: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Please login first.");

  const { data: listing, error } = await supabase
    .from("properties")
    .insert([
      {
        ...data,
        user_id: user.id,
        status: "draft",
        payment_status: "pending",
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return listing;
}