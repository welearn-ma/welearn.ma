"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie, Shield } from "lucide-react";
import Link from "next/link";
import {
  CONSENT_OPEN_EVENT,
  readConsent,
  saveConsent,
} from "@/lib/cookie-consent";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  // Vrai uniquement à la réouverture via « Gérer les cookies » alors qu'un choix
  // existe déjà : le bandeau peut alors être fermé sans nouveau choix.
  const [dismissible, setDismissible] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
  });

  useEffect(() => {
    // Aucun choix valide (absent ou expiré après 13 mois) : afficher le bandeau.
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (!readConsent()) {
      timer = setTimeout(() => setIsVisible(true), 1000);
    }

    // Lien « Gérer les cookies » : rouvrir le bandeau avec le choix actuel.
    const onOpen = () => {
      if (timer) clearTimeout(timer);
      const current = readConsent();
      setPreferences({
        necessary: true,
        analytics: current?.analytics === true,
      });
      // Sans choix enregistré, un choix reste obligatoire (comportement 1re visite).
      setDismissible(current !== null);
      setShowPreferences(false);
      setIsVisible(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
    };
  }, []);

  const close = () => {
    setIsVisible(false);
    setShowPreferences(false);
    setDismissible(false);
  };

  // Échap ferme le bandeau rouvert, sans toucher au choix enregistré.
  useEffect(() => {
    if (!isVisible || !dismissible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isVisible, dismissible]);

  const acceptAll = () => {
    saveConsent(true);
    close();
  };

  const refuseAll = () => {
    saveConsent(false);
    close();
  };

  const savePreferences = () => {
    saveConsent(preferences.analytics);
    close();
  };

  if (!isVisible) return null;

  return (
    <>
    {dismissible && (
      // Zone de clic transparente : un clic hors du bandeau le ferme sans changer le choix.
      <div className="fixed inset-0 z-40" onClick={close} aria-hidden="true" />
    )}
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur border-t border-border shadow-2xl">
      <div className="mx-auto max-w-7xl">
        {!showPreferences ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="h-6 w-6 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-sans font-bold text-foreground mb-1">
                  Nous utilisons des cookies
                </h3>
                <p className="text-sm text-muted-foreground">
                  Nous utilisons des cookies nécessaires au fonctionnement du
                  site ainsi que des cookies de mesure d’audience destinés à
                  comprendre son utilisation. Vous pouvez accepter ou refuser
                  ces derniers à tout moment.{" "}
                  <Link
                    href="/confidentialite"
                    className="text-primary hover:underline"
                  >
                    En savoir plus
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreferences(true)}
                className="text-sm"
              >
                Personnaliser
              </Button>
              <Button
                size="sm"
                onClick={refuseAll}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Tout refuser
              </Button>
              <Button
                size="sm"
                onClick={acceptAll}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Tout accepter
              </Button>
              {dismissible && (
                <button
                  onClick={close}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Fermer sans modifier mon choix"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-foreground flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Préférences de confidentialité
              </h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Fermer les préférences"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between p-4 bg-secondary rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm text-foreground mb-1">
                    Cookies nécessaires
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Essentiels au fonctionnement du site. Toujours actifs.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    aria-label="Cookies nécessaires (toujours actifs)"
                    className="h-5 w-5 rounded border-gray-300"
                  />
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-4 bg-secondary rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm text-foreground mb-1">
                    Cookies analytiques
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Nous aident à comprendre comment vous utilisez notre site
                    (Google Analytics).
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        analytics: e.target.checked,
                      })
                    }
                    aria-label="Cookies analytiques"
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreferences(false)}
              >
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={savePreferences}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Enregistrer mes préférences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
