"use client";

import { useState } from "react";

const COOKIE_CONSENT_KEY = "homelinker_cookie_consent";

export default function CookieSettings() {
  const [open, setOpen] = useState(false);

  function saveChoice(choice: "accepted" | "necessary") {
    localStorage.setItem(COOKIE_CONSENT_KEY, choice);

    window.dispatchEvent(
      new CustomEvent("homelinker-cookie-consent", {
        detail: choice,
      })
    );

    setOpen(false);

    // Reload so analytics/components update cleanly
    window.location.reload();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-gray-500 underline underline-offset-4 transition hover:text-[#C9A227]"
      >
        Cookie Settings
      </button>

      {open && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#111111] p-6 text-white shadow-2xl">
            <h2 className="text-xl font-bold">
              Cookie Settings
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-300">
              Choose whether HomeLinker may use analytics cookies.
              Necessary cookies are always used because they are
              required for the website to function.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => saveChoice("necessary")}
                className="flex-1 rounded-xl border border-gray-600 px-5 py-3 text-sm font-semibold text-gray-200 transition hover:bg-white/5"
              >
                Necessary Only
              </button>

              <button
                type="button"
                onClick={() => saveChoice("accepted")}
                className="flex-1 rounded-xl bg-[#C9A227] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#d8b32e]"
              >
                Accept Analytics
              </button>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full text-sm text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}