import ApiError from '../utils/ApiError.js';

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError('Insufficient permissions', 403));
  }
  next();
};

export default requireRole;