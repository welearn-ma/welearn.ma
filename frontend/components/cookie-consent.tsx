"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie, Shield } from "lucide-react";
import Link from "next/link";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const acceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    setIsVisible(false);
    // Initialize analytics here if accepted
  };

  const acceptNecessary = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    setIsVisible(false);
  };

  const savePreferences = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    setIsVisible(false);
    setShowPreferences(false);
  };

  if (!isVisible) return null;

  return (
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
                  Nous utilisons des cookies pour améliorer votre expérience,
                  analyser notre trafic et personnaliser le contenu.{" "}
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
                variant="outline"
                size="sm"
                onClick={acceptNecessary}
                className="text-sm"
              >
                Nécessaires uniquement
              </Button>
              <Button
                size="sm"
                onClick={acceptAll}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Tout accepter
              </Button>
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
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between p-4 bg-secondary rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm text-foreground mb-1">
                    Cookies marketing
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Utilisés pour afficher des contenus et publicités
                    pertinents.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        marketing: e.target.checked,
                      })
                    }
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
  );
}
