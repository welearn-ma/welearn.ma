import { Router } from "express";
import { createRegistration } from "../controllers/registrationController";

const router = Router();

router.post("/", createRegistration);

export default router;
