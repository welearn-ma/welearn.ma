import type { NextFunction, Request, Response } from "express";

/**
 * Limitation de debit en memoire du processus, par IP (fenetre glissante).
 * Best effort : remise a zero a chaque redemarrage, non partagee entre
 * plusieurs processus Passenger.
 */

/**
 * IP du client : DERNIERE entree de X-Forwarded-For (celle ajoutee par le
 * proxy Passenger / Apache devant Node), sinon l'adresse du socket.
 * Les entrees precedentes de l'en-tete sont fournies par le client et ne
 * sont jamais utilisees.
 */
export function clientIp(req: Request): string | null {
  const header = req.headers["x-forwarded-for"];
  const raw = Array.isArray(header) ? header.join(",") : header;
  if (raw) {
    const parts = raw
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) {
      return last;
    }
  }
  return req.socket.remoteAddress ?? null;
}

const LOOPBACK = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

export interface RateLimiterOptions {
  /** Nom court pour les journaux. */
  name: string;
  limit: number;
  windowMs: number;
  onLimited: (req: Request, res: Response) => void;
  now?: () => number;
}

export function createRateLimiter({
  name,
  limit,
  windowMs,
  onLimited,
  now = Date.now,
}: RateLimiterOptions) {
  const hits = new Map<string, number[]>();
  let lastSweep = 0;
  let warnedNoClientIp = false;

  return function rateLimit(req: Request, res: Response, next: NextFunction): void {
    const ip = clientIp(req);

    // Pas d'IP client exploitable (proxy sans X-Forwarded-For) : appliquer
    // la limite bloquerait TOUS les visiteurs ensemble. On laisse passer et
    // on le signale une fois (aucune donnee personnelle).
    if (!ip || LOOPBACK.has(ip)) {
      if (!warnedNoClientIp) {
        warnedNoClientIp = true;
        console.warn(
          `[rate-limit] ${name}: no client IP (no X-Forwarded-For, loopback socket); limit not applied`,
        );
      }
      next();
      return;
    }

    const current = now();
    const windowStart = current - windowMs;

    if (current - lastSweep > windowMs) {
      for (const [key, stamps] of hits) {
        const kept = stamps.filter((stamp) => stamp > windowStart);
        if (kept.length) {
          hits.set(key, kept);
        } else {
          hits.delete(key);
        }
      }
      lastSweep = current;
    }

    const recent = (hits.get(ip) ?? []).filter((stamp) => stamp > windowStart);
    if (recent.length >= limit) {
      hits.set(ip, recent);
      onLimited(req, res);
      return;
    }

    recent.push(current);
    hits.set(ip, recent);
    next();
  };
}
