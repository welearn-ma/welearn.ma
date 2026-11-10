"use client";

import { requestConsentBannerOpen } from "@/lib/cookie-consent";

/** Rouvre le bandeau cookies pour modifier ou retirer son consentement. */
export function ManageCookiesButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={requestConsentBannerOpen}
      className={className}
    >
      Gérer les cookies
    </button>
  );
}
