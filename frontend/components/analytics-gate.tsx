"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import {
  CONSENT_CHANGE_EVENT,
  GA_MEASUREMENT_ID,
  readConsent,
  removeAnalyticsCookies,
  type ConsentState,
} from "@/lib/cookie-consent";

/**
 * Charge Google Analytics et Vercel Analytics uniquement après consentement
 * explicite. Rendu serveur / premier rendu : rien (aucun script, aucun cookie).
 */
export function AnalyticsGate() {
  const [enabled, setEnabled] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    const allowed = readConsent()?.analytics === true;
    // Sans consentement : purge les cookies GA hérités de l'ancien chargement
    // inconditionnel (visiteurs antérieurs à la mise en place du bandeau).
    if (!allowed) removeAnalyticsCookies();
    setEnabled(allowed);

    const onChange = (event: Event) => {
      const next =
        (event as CustomEvent<ConsentState | null>).detail?.analytics === true;

      if (!next && loadedRef.current) {
        // Retrait après acceptation sur cette page : on coupe GA immédiatement,
        // on supprime ses cookies, puis on recharge pour décharger les scripts.
        (window as unknown as Record<string, boolean>)[
          `ga-disable-${GA_MEASUREMENT_ID}`
        ] = true;
        removeAnalyticsCookies();
        window.location.reload();
        return;
      }
      setEnabled(next);
    };

    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  }, []);

  useEffect(() => {
    if (enabled) loadedRef.current = true;
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Analytics />
    </>
  );
}
