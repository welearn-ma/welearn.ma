import { Router } from "express";
import { createSponsor, listSponsors } from "../controllers/sponsorController";

const router = Router();

router.get("/", listSponsors);
router.post("/", createSponsor);

export default router;
