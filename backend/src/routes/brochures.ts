import { Router } from "express";
import { requestBrochure } from "../controllers/brochureController";

const router = Router();

router.post("/request", requestBrochure);

export default router;
