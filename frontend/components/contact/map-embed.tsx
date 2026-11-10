"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15778.335901280869!2d-7.640232!3d33.542951!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda62db9d09e3653%3A0xa4a712af3cd8a7a3!2sWelearn!5e1!3m2!1sfr!2sus!4v1765470968412!5m2!1sfr!2sus";

/**
 * Carte Google Maps chargée uniquement au clic : aucune requête vers Google
 * (ni cookie) avant l'action explicite du visiteur. Remplit son conteneur.
 */
export function MapEmbed() {
  const [showMap, setShowMap] = useState(false);

  if (showMap) {
    return (
      <iframe
        src={MAP_SRC}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Welearn Location"
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-wl-gray-light px-6 text-center">
      <div className="p-3 bg-wl-blue-tint rounded-xl">
        <MapPin className="h-6 w-6 text-wl-blue" />
      </div>
      <button
        type="button"
        onClick={() => setShowMap(true)}
        className="cursor-pointer rounded-lg bg-wl-blue px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-wl-blue-dark"
      >
        Afficher la carte
      </button>
      <p className="max-w-xs text-xs text-wl-text-secondary">
        En affichant la carte, vous acceptez le dépôt de cookies par Google
        Maps.
      </p>
    </div>
  );
}
