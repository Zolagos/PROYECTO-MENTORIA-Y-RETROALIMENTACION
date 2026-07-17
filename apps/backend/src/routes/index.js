import { Router } from "express";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import sessionsRoutes from "./sessions.routes.js";
import mentoringRequests from "./mentoring.requests.js";
import coderObservations from "./coder.observations.js";
import tutorObservations from "./tutor.observations.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/sessions", sessionsRoutes);
router.use("/", mentoringRequests);
router.use("/", coderObservations);
router.use("/", tutorObservations);

export default router;
