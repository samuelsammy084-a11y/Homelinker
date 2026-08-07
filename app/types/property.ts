export type Property = {
  id: number;
  title: string;
  price: number;
  location?: string;

  province?: string;
  city?: string;
  type?: string;
  property_type?: string;

  images?: string[];
  image_urls?: string[];
  image_url?: string | null;

  bedrooms?: number;
  bathrooms?: number;
  parking?: number;

  featured?: boolean;
  verified?: boolean;
  slug?: string;
  description?: string;
};