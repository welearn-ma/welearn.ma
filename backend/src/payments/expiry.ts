import { PENDING_EXPIRY_INTERVAL_MS, PENDING_ORDER_TTL_MS } from "../config/commerce";

/**
 * Expiration des commandes PENDING de plus de 45 min (-> FAILED).
 * Source de verite : l'appel paresseux au debut de chaque /cmi/init (et a
 * chaque liste admin des codes). Le minuteur n'est qu'un complement : sous
 * Passenger, le processus peut etre arrete quand il n'y a pas de trafic.
 * Un callback 00 tardif sur une commande FAILED recoit FAILURE (regle
 * existante) : la PreAuth n'est pas capturee.
 */

interface ExpiryStore {
  expirePendingOrders(cutoff: string, now: string): Promise<number>;
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : "unknown error";
}

/** Ne leve jamais. Retourne le nombre de commandes expirees (0 si erreur). */
export async function expireStalePendingOrders(store: ExpiryStore, now: Date): Promise<number> {
  const cutoff = new Date(now.getTime() - PENDING_ORDER_TTL_MS);
  try {
    const count = await store.expirePendingOrders(cutoff.toISOString(), now.toISOString());
    if (count > 0) {
      console.log(`[payments] expired ${count} stale PENDING order(s)`);
    }
    return count;
  } catch (error) {
    console.error(`[payments] pending expiry failed: ${describe(error)}`);
    return 0;
  }
}

/** Minuteur best effort ; unref() : ne retient jamais le processus. */
export function startPendingExpiryTimer(
  store: ExpiryStore,
  intervalMs: number = PENDING_EXPIRY_INTERVAL_MS,
  now: () => Date = () => new Date(),
): NodeJS.Timeout {
  const timer = setInterval(() => {
    void expireStalePendingOrders(store, now());
  }, intervalMs);
  timer.unref();
  return timer;
}
