/**
 * Promotions a duree limitee (table promotions, migration
 * 20261127005000_promotions.sql). Les dates viennent TOUJOURS de la base ;
 * l'instant de reference est l'horloge du serveur (jamais le navigateur).
 *
 * Fenetre semi-ouverte [starts_at, ends_at[ : starts_at / ends_at sont des
 * instants (timestamptz), calcules en heure de Casablanca par Postgres dans
 * la migration. La comparaison se fait sur les instants : elle ne depend
 * ni du fuseau du serveur ni de celui du navigateur.
 */

/** Ligne promotions. */
export interface PromotionRecord {
  id: string;
  label: string;
  percent_off: number;
  starts_at: string;
  /** Exclu : la promotion s'arrete a cet instant. */
  ends_at: string;
  active: boolean;
}

/** Promotion et ses produits (ecran admin). */
export interface PromotionWithProducts extends PromotionRecord {
  product_slugs: string[];
}

/** Promotion telle que le site l'affiche (aucune donnee interne). */
export interface PublicPromotion {
  label: string;
  percent_off: number;
  ends_at: string;
}

export type PromotionStatus = "running" | "scheduled" | "ended" | "disabled";

function instant(value: string): number {
  return new Date(value).getTime();
}

/** Etat d'une promotion a l'instant `now`. */
export function promotionStatus(promotion: PromotionRecord, now: Date): PromotionStatus {
  if (!promotion.active) return "disabled";
  const start = instant(promotion.starts_at);
  const end = instant(promotion.ends_at);
  const at = now.getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || at >= end) return "ended";
  return at < start ? "scheduled" : "running";
}

function isUsablePercent(percent: number): boolean {
  return Number.isFinite(percent) && percent > 0 && percent < 100;
}

/**
 * Promotion applicable a l'instant `now` parmi celles d'un produit : active,
 * starts_at <= now < ends_at. Si plusieurs se chevauchent, la plus
 * avantageuse pour le client (puis la plus ancienne, puis l'id) ; null sinon.
 */
export function runningPromotion(
  promotions: ReadonlyArray<PromotionRecord>,
  now: Date,
): PromotionRecord | null {
  const running = promotions.filter(
    (promotion) =>
      promotionStatus(promotion, now) === "running" && isUsablePercent(promotion.percent_off),
  );
  running.sort(
    (a, b) =>
      b.percent_off - a.percent_off ||
      instant(a.starts_at) - instant(b.starts_at) ||
      a.id.localeCompare(b.id),
  );
  return running[0] ?? null;
}

export function toPublicPromotion(promotion: PromotionRecord | null): PublicPromotion | null {
  return promotion
    ? { label: promotion.label, percent_off: promotion.percent_off, ends_at: promotion.ends_at }
    : null;
}
