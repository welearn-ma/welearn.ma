import { Router } from "express";
import {
  listAdminRegistrations,
  updateRegistrationTreated,
} from "../controllers/registrationController";

const router = Router();

router.get("/", listAdminRegistrations);
router.patch("/:id/treated", updateRegistrationTreated);

export default router;
