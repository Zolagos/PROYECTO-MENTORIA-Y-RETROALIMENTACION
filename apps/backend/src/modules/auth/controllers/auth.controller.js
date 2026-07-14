import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/ApiResponse.js";

import authService from "../services/auth.service.js";

const login = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const user = await authService.login(token);

  return ApiResponse.success(
    res,
    user,
    "Inicio de sesión exitoso"
  );
});

const me = asyncHandler(async (req, res) => {
  return ApiResponse.success(
    res,
    req.user,
    "Authenticated user"
  );
});

export default {
  login,
  me,
};
