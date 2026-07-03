import { Router } from "express";
import { createSponsor } from "../controllers/sponsorController";

const router = Router();

router.post("/", createSponsor);

export default router;
