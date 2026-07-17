import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import authService from "../services/auth.service.js";

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { token, user } = await authService.login(email, password);

  return ApiResponse.success(
    res,
    {
      token,
      user,
    },
    "Inicio de sesión exitoso"
  );
});

const me = asyncHandler(async (req, res) => {
  return ApiResponse.success(
    res,
    {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      clanId: req.user.clanId,
    },
    "Usuario autenticado"
  );
});

export default {
  login,
  me,
};
