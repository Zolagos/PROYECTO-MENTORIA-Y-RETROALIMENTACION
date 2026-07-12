import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    module: "Auth",
    status: "OK",
    message: "Módulo de autenticación funcionando."
  });
});

export default router;
