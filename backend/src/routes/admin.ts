import { Router } from "express";
import { getAdminSession } from "../controllers/adminController";

const router = Router();

router.get("/session", getAdminSession);

export default router;
