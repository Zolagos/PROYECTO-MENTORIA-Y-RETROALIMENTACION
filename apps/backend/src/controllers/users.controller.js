import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import * as usersRepository from '../repositories/users.repository.js';

export const listByRole = asyncHandler(async (req, res) => {
  const { role } = req.query;
  if (!['Tutor', 'Coder'].includes(role)) {
    throw new ApiError('role must be Tutor or Coder', 400);
  }
  const users = await usersRepository.findByRole(role);
  return ApiResponse.success(res, users);
});