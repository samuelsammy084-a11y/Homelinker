export type Property = {
  // ============================================
  // CORE
  // ============================================

  id: number;

  title: string;

  description?: string | null;

  price: number;

  // ============================================
  // LOCATION
  // ============================================

  city: string;

  province: string;

  location?: string | null;

  suburb?: string | null;

  street_address?: string | null;

  address?: string | null;

  postal_code?: string | null;

  latitude?: number | null;

  longitude?: number | null;

  // ============================================
  // PROPERTY TYPE / DETAILS
  // ============================================

  property_type?: string | null;

  listing_type?: string | null;

  bedrooms?: number | null;

  bathrooms?: number | null;

  parking?: number | null;

  floor_size?: number | null;

  land_size?: number | null;

  property_condition?: string | null;

  condition?: string | null;

  furnished?: boolean | null;

  pet_friendly?: boolean | null;

  // ============================================
  // RENT / SALE INFORMATION
  // ============================================

  deposit?: number | null;

  available_from?: string | null;

  bond_price?: number | null;

  rates?: number | null;

  levies?: number | null;

  // ============================================
  // IMAGES
  // ============================================

  image_url?: string | null;

  image_urls?: string[] | null;

  // ============================================
  // OWNERSHIP
  // ============================================

  user_id?: string | null;

  owner_name?: string | null;

  owner_verified?: boolean;

  // ============================================
  // CONTACT
  // ============================================

  contact_name?: string | null;

  contact_number?: string | null;

  contact_phone?: string | null;

  show_contact_phone?: boolean | null;

  // ============================================
  // LISTING STATUS
  // ============================================

  status?: string | null;

  // ============================================
  // VERIFICATION
  // ============================================

  verified?: boolean;

  verification_status?: string | null;

  // ============================================
  // PLAN
  // ============================================

  plan?:
    | "free"
    | "premium"
    | "pro"
    | string
    | null;

  payment_status?: string | null;

  // ============================================
  // PROMOTION
  // ============================================

  /**
   * True when the property currently has a
   * promotion attached to it.
   */
  is_promoted?: boolean;

  /**
   * Used by the Pro package.
   * Pro advertisers can choose up to 3
   * Priority Properties.
   */
  is_priority?: boolean;

  /**
   * Identifies which product granted the
   * promotion.
   *
   * premium = individual Premium purchase
   * pro     = advertiser Pro package
   */
  promotion_source?:
    | "premium"
    | "pro"
    | null;

  /**
   * When the current paid promotion began.
   */
  promotion_starts_at?: string | null;

  /**
   * When the current paid promotion ends.
   *
   * This is separate from the listing's
   * normal expires_at field.
   */
  promotion_expires_at?: string | null;

  // ============================================
  // POPULAR / FEATURED
  // ============================================

  /**
   * Existing HomeLinker listings that were
   * already displayed in Popular Listings
   * before the paid-placement rules changed.
   *
   * New Free listings must never automatically
   * receive this flag.
   */
  legacy_popular?: boolean;

  /**
   * Featured placement flag.
   *
   * New Free listings should be false.
   * Premium and selected Pro properties can
   * receive featured/promoted placement.
   */
  featured?: boolean;

  /**
   * Expiry for featured placement.
   */
  featured_until?: string | null;

  // ============================================
  // PAYMENT
  // ============================================

  stripe_session_id?: string | null;

  // ============================================
  // URL
  // ============================================

  slug?: string;

  // ============================================
  // DATES
  // ============================================

  created_at?: string | null;

  updated_at?: string | null;

  published_at?: string | null;

  /**
   * Normal listing expiry.
   *
   * Do not confuse this with
   * promotion_expires_at.
   */
  expires_at?: string | null;
};