export type Property = {
  id: number;
  title: string;
  price: number;
  location: string;

  province: string;
  city: string;
  type: string;

  images: string[];

  bedrooms: number;
  bathrooms: number;
  parking: number;

  featured: boolean;
  verified: boolean;
};