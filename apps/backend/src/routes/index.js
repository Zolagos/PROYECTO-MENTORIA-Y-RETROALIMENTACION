import { Router } from "express";
import authRoutes from "../modules/auth/routes/auth.routes.js";
import mentoringRequests from "./mentoring.requests.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/", mentoringRequests);

export default router;
