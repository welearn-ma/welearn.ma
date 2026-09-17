import { Router } from "express";
import { getAdminActivity } from "../controllers/adminController";

const router = Router();

router.get("/", getAdminActivity);

export default router;
