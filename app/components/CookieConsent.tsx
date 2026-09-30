"use client";

import { useEffect, useState } from "react";

type ConsentChoice = "accepted" | "necessary";

const COOKIE_CONSENT_KEY = "homelinker_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (!saved) {
      setVisible(true);
    }
  }, []);

  function saveChoice(choice: ConsentChoice) {
    localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    window.dispatchEvent(
      new CustomEvent("homelinker-cookie-consent", {
        detail: choice,
      })
    );
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#C9A227]/30 bg-[#111111] p-5 text-white shadow-2xl sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-lg font-bold">
              🍪 We use cookies
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-300">
              HomeLinker uses necessary cookies to keep the website working.
              With your permission, we may also use analytics cookies to
              understand how people use HomeLinker and improve the experience.
            </p>

            <p className="mt-2 text-xs text-gray-400">
              You can change your preference later through our cookie settings.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
            <button
              type="button"
              onClick={() => saveChoice("necessary")}
              className="rounded-xl border border-gray-600 px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-gray-400 hover:bg-white/5"
            >
              Necessary Only
            </button>

            <button
              type="button"
              onClick={() => saveChoice("accepted")}
              className="rounded-xl bg-[#C9A227] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#d8b32e]"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}