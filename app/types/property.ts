export type Property = {
  id: number;

  title: string;
  slug?: string;

  description: string | null;

  price: number;

  property_type: string;
  city: string;
  province: string;

  street_address: string | null;
  suburb: string | null;

  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;

  image_url: string | null;
  image_urls: string[] | null;

  user_id: string | null;

  contact_number: string | null;
  contact_name: string | null;
  owner_name: string | null;

  verification_status: string | null;

  latitude: number | null;
  longitude: number | null;

  created_at: string | null;

  featured?: boolean;
  verified?: boolean;
};