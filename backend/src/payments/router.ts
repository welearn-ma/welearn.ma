import cors from "cors";
import express, {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { siteOrigins, type CmiConfigResult } from "../config/cmi";
import { CODE_CHECK_RATE_LIMIT } from "../config/commerce";
import {
  createPaymentHandlers,
  paymentPagePath,
  redirectToFailure,
  sendCallbackReply,
} from "../controllers/paymentController";
import { createRateLimiter } from "../lib/rateLimit";
import { createCatalogHandlers } from "./catalog";
import type { PaymentStore } from "./store";

export interface PaymentsRouterDeps {
  cmi: CmiConfigResult;
  store: PaymentStore;
  now?: () => Date;
}

type Handler = (req: Request, res: Response) => void | Promise<void>;

/**
 * Parseur urlencoded (CMI et le navigateur postent des formulaires). Une
 * erreur de parsing (corps trop gros, charset non supporte...) ne remonte
 * JAMAIS au gestionnaire d'erreurs Express : elle produit la reponse
 * "echec" propre a chaque route.
 */
function formBody(onParseError: Handler) {
  const parse = express.urlencoded({ extended: false });
  return (req: Request, res: Response, next: NextFunction) => {
    parse(req, res, (error?: unknown) => {
      if (error) {
        console.error(`[payments] ${req.path}: form body could not be parsed`);
        void onParseError(req, res);
        return;
      }
      next();
    });
  };
}

function noStore(_req: Request, res: Response, next: NextFunction): void {
  res.set("Cache-Control", "no-store");
  next();
}

/** Corps JSON (POST /codes/check) ; erreur de parsing -> { valid: false }. */
function jsonBody(req: Request, res: Response, next: NextFunction): void {
  express.json({ limit: "2kb" })(req, res, (error?: unknown) => {
    if (error) {
      res.status(400).json({ valid: false });
      return;
    }
    next();
  });
}

/**
 * Routes /api/payments. A monter AVANT le cors() global et express.json()
 * dans index.ts : le retour navigateur depuis la page CMI arrive avec une
 * Origin etrangere (ou "null") que le cors() global rejetterait.
 * CORS (SITE_URL + variante www) sur les routes appelees par le site :
 * GET /order-status, GET /products/:slug, POST /codes/check.
 */
export function createPaymentsRouter({ cmi, store, now }: PaymentsRouterDeps): Router {
  const router = Router();
  router.use(noStore);

  const siteUrl = cmi.enabled ? cmi.config.siteUrl : cmi.fallbackSiteUrl;
  const failurePage = `${siteUrl}${paymentPagePath("echec")}`;
  const orderStatusCors = cors({ origin: siteOrigins(siteUrl), methods: ["GET"] });
  const productCors = cors({ origin: siteOrigins(siteUrl), methods: ["GET"] });
  const codeCheckCors = cors({ origin: siteOrigins(siteUrl), methods: ["POST"] });

  router.options("/order-status", orderStatusCors);
  router.options("/products/:slug", productCors);
  router.options("/codes/check", codeCheckCors);

  if (!cmi.enabled) {
    // Paiement desactive (variables CMI manquantes) : reponses neutres.
    router.post("/cmi/init", (_req, res) => redirectToFailure(res, siteUrl, "unavailable"));
    router.post("/cmi/callback", (_req, res) => sendCallbackReply(res, "FAILURE"));
    router.post("/cmi/return", (_req, res) => res.redirect(302, failurePage));
    router.get("/order-status", orderStatusCors, (_req, res) => {
      res.status(503).json({ error: "unavailable" });
    });
    router.get("/products/:slug", productCors, (_req, res) => {
      res.status(503).json({ error: "unavailable" });
    });
    router.post("/codes/check", codeCheckCors, (_req, res) => {
      res.status(503).json({ valid: false });
    });
    return router;
  }

  const catalog = createCatalogHandlers({ store, now });
  const codeCheckLimit = createRateLimiter({
    name: "codes-check",
    ...CODE_CHECK_RATE_LIMIT,
    onLimited: (_req, res) => {
      res.status(429).json({ valid: false });
    },
  });

  router.get("/products/:slug", productCors, catalog.product);
  router.post("/codes/check", codeCheckCors, codeCheckLimit, jsonBody, catalog.checkCode);

  const handlers = createPaymentHandlers({ config: cmi.config, store, now });

  router.post(
    "/cmi/init",
    formBody((_req, res) => redirectToFailure(res, siteUrl, "invalid")),
    handlers.init,
  );
  router.post(
    "/cmi/callback",
    formBody((_req, res) => sendCallbackReply(res, "FAILURE")),
    handlers.callback,
  );
  router.post(
    "/cmi/return",
    formBody((_req, res) => res.redirect(302, failurePage)),
    handlers.handleReturn,
  );
  router.get("/order-status", orderStatusCors, handlers.orderStatus);

  return router;
}
