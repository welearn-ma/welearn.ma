import { Router } from "express";
import {
	createRegistration,
	listRegistrations,
} from "../controllers/registrationController";

const router = Router();

router.get("/", listRegistrations);
router.post("/", createRegistration);

export default router;
