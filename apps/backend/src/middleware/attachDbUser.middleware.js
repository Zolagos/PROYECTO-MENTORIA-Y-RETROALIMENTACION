import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { findById } from '../repositories/users.repository.js';

const attachDbUser = asyncHandler(async (req, res, next) => {
  const dbUser = await findById(req.user.id);
  if (!dbUser) throw new ApiError('User not found', 401);

  req.user.dbId = dbUser.id;
  req.user.role = dbUser.role;
  req.user.clanId = dbUser.clan_id;
  next();
});

export default attachDbUser;
