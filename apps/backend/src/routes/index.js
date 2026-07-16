import { Router } from "express";
import authRoutes from "../modules/auth/routes/auth.routes.js";
import usersRoutes from "../modules/users/routes/users.routes.js";
import sessionsRoutes from "../modules/sessions/routes/sessions.routes.js";
import mentoringRequests from "src/controllers/mentoring.requests.controller.js";
import coderObservations from "src/controllers/coder.observations.controller.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/sessions", sessionsRoutes);
router.use("/", mentoringRequests);
router.use("/", coderObservations);

export default router;
