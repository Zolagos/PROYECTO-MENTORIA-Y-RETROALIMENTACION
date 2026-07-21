import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import * as usersRepository from '../repositories/users.repository.js';
import { ROLES } from '../config/roles.js';

export const listByRole = asyncHandler(async (req, res) => {
  const { role, allClans } = req.query;
  if (![ROLES.TUTOR, ROLES.CODER].includes(role)) {
    throw new ApiError(`role must be ${ROLES.TUTOR} or ${ROLES.CODER}`, 400);
  }

  // Cross-clan coder listing is only needed to assign participants to an
  // 'open' session (any clan is a valid target there); every other picker
  // in the app must stay scoped to the caller's own clan.
  const wantsAllClans =
    allClans === 'true' &&
    role === ROLES.CODER &&
    (req.user.role === ROLES.TEAM_LEADER || req.user.role === ROLES.TUTOR);

  let clanId = null;
  if (!wantsAllClans) {
    clanId = Number(req.user.clanId);
    if (!Number.isInteger(clanId) || clanId <= 0) {
      throw new ApiError('The authenticated user is not assigned to a clan', 409);
    }
  }

  const users = await usersRepository.findByRole(role, clanId);
  return ApiResponse.success(res, users);
});