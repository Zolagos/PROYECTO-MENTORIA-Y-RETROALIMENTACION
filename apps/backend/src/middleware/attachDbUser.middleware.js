import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { findByUid } from '../modules/users/repositories/users.repository.js';

const attachDbUser = asyncHandler(async (req, res, next) => {
  const dbUser = await findByUid(req.user.uid);
  if (!dbUser) throw new ApiError('User not found', 401);

  req.user.dbId = dbUser.id;
  req.user.role = dbUser.role;
  req.user.clanId = dbUser.clan_id;
  next();
});

export default attachDbUser;