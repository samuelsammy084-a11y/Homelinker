export type Property = {
  id: number;

  title: string;
  description?: string | null;

  price: number;

  city: string;
  province: string;

  property_type?: string | null;

  bedrooms?: number | null;
  bathrooms?: number | null;
  parking?: number | null;

  image_url?: string | null;
  image_urls?: string[] | null;

  featured?: boolean;
  verified?: boolean;

  // Popular / paid promotion
  is_promoted?: boolean;

  // Ownership
  user_id?: string | null;

  // URL
  slug?: string;

  // Owner
  owner_name?: string | null;
  owner_verified?: boolean;

  // Address
  address?: string | null;
  street_address?: string | null;
  suburb?: string | null;
  postal_code?: string | null;

  // Map location
  latitude?: number | null;
  longitude?: number | null;

  // Property details
  property_condition?: string | null;
  pet_friendly?: boolean | null;

  // Listing information
  listing_type?: string | null;
  bond_price?: number | null;

  // Verification
  verification_status?: string | null;

  // Contact
  contact_number?: string | null;
  contact_name?: string | null;

  // Dates
  created_at?: string | null;
  updated_at?: string | null;
};