"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

const COOKIE_CONSENT_KEY = "homelinker_cookie_consent";

export default function GoogleAnalyticsConsent() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (saved === "accepted") {
      setAnalyticsAllowed(true);
    }

    function handleConsent(event: Event) {
      const customEvent = event as CustomEvent<string>;

      if (customEvent.detail === "accepted") {
        setAnalyticsAllowed(true);
      } else {
        setAnalyticsAllowed(false);
      }
    }

    window.addEventListener(
      "homelinker-cookie-consent",
      handleConsent
    );

    return () => {
      window.removeEventListener(
        "homelinker-cookie-consent",
        handleConsent
      );
    };
  }, []);

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaId || !analyticsAllowed) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}