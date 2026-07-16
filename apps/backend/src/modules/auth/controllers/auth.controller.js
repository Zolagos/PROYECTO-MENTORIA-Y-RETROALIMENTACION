import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/ApiResponse.js";

import authService from "../services/auth.service.js";

const login = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const user = await authService.login(token);

  return ApiResponse.success(
    res,
    {
      uid: user.uid,
      email: user.email,
      emailVerified: user.email_verified,
    },
    "Inicio de sesión exitoso"
  );
});

const me = asyncHandler(async (req, res) => {
  return ApiResponse.success(
    res,
    {
      uid: req.user.uid,
      email: req.user.email,
      emailVerified: req.user.email_verified,
    },
    "Usuario autenticado"
  );
});

export default {
  login,
  me,
};
