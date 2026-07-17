import { Router } from "express";
import authRoutes from "../modules/auth/routes/auth.routes.js";
import mentoringRequests from "./mentoring.requests.js";
import coderObservations from "./coder.observations.js";
import tutorObservations from "./tutor.observations.js";
import sessionFeedback from "./session.feedback.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/sessions", sessionsRoutes);
router.use("/", mentoringRequests);
router.use("/", coderObservations);
router.use("/", tutorObservations);
router.use("/", sessionFeedback);

export default router;
