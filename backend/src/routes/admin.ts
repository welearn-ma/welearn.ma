import { Router } from "express";
import { getAdminSession } from "../controllers/adminController";
import adminActivityRouter from "./admin-activity";
import adminRegistrationsRouter from "./admin-registrations";
import adminSponsorsRouter from "./admin-sponsors";

const router = Router();

router.get("/session", getAdminSession);
router.use("/registrations", adminRegistrationsRouter);
router.use("/sponsors", adminSponsorsRouter);
router.use("/activity", adminActivityRouter);

export default router;
