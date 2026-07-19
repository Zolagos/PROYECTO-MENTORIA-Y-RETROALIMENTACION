import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import * as usersRepository from '../repositories/users.repository.js';
import { ROLES } from '../config/roles.js';

export const listByRole = asyncHandler(async (req, res) => {
  const { role } = req.query;
  if (![ROLES.TUTOR, ROLES.CODER].includes(role)) {
    throw new ApiError(`role must be ${ROLES.TUTOR} or ${ROLES.CODER}`, 400);
  }
  const users = await usersRepository.findByRole(role);
  return ApiResponse.success(res, users);
});