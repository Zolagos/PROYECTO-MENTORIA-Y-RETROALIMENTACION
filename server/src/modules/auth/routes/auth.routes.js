import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    module: "Auth",
    status: "OK",
    message: "Módulo de autenticación funcionando."
  });
});

router.post("/login", authController.login);

router.get(
  "/me",
  authMiddleware,
  authController.me
);

export default router;
