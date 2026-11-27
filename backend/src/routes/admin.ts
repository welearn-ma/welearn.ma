import { Router } from "express";
import { createAdminCommerceRouters } from "../commerce/adminRouter";
import { getAdminSession } from "../controllers/adminController";
import { validateAdminAccessToken } from "../lib/adminAuth";
import adminActivityRouter from "./admin-activity";
import adminRegistrationsRouter from "./admin-registrations";
import adminSponsorsRouter from "./admin-sponsors";
import { commerceStore, contactRecipient, mailer, proofFiles, siteUrl } from "./commerceDeps";

const router = Router();

const commerce = createAdminCommerceRouters({
  store: commerceStore,
  files: proofFiles,
  mailer,
  siteUrl,
  replyTo: contactRecipient,
  verifyAdmin: validateAdminAccessToken,
});

router.get("/session", getAdminSession);
router.use("/registrations", adminRegistrationsRouter);
router.use("/sponsors", adminSponsorsRouter);
router.use("/activity", adminActivityRouter);
router.use("/student-proofs", commerce.studentProofs);
router.use("/codes", commerce.codes);
router.use("/promotions", commerce.promotions);

export default router;
