import { Router } from "express";
import {
  listAdminSponsors,
  updateSponsorTreated,
} from "../controllers/sponsorController";

const router = Router();

router.get("/", listAdminSponsors);
router.patch("/:id/treated", updateSponsorTreated);

export default router;
