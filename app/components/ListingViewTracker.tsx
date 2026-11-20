"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ListingViewTracker({ propertyId }: { propertyId: number }) {
  useEffect(() => {
    async function recordView() {
      const day = new Intl.DateTimeFormat("en-ZA", { timeZone: "Africa/Johannesburg" }).format(new Date());
      const storageKey = "homelinker-view-visitor";
      try {
        if (localStorage.getItem("homelinker_cookie_consent") !== "accepted") return;
        const [storedDay, storedKey] = (localStorage.getItem(storageKey) ?? "").split("|");
        const visitorKey = storedDay === day && storedKey ? storedKey : crypto.randomUUID();
        localStorage.setItem(storageKey, `${day}|${visitorKey}`);
        await supabase.rpc("record_listing_view", {
          p_property_id: propertyId,
          p_visitor_key: visitorKey,
        });
      } catch {
        // Analytics must not interfere with reading the listing.
      }
    }

    const recordConsentedView = () => { void recordView(); };
    recordConsentedView();
    window.addEventListener("homelinker-cookie-consent", recordConsentedView);
    return () => window.removeEventListener("homelinker-cookie-consent", recordConsentedView);
  }, [propertyId]);

  return null;
}
