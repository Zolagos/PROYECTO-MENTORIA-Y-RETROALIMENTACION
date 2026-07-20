import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { ROLES } from '../config/roles.js';
import * as observationsService from '../services/observations.service.js';

export const listObservations = asyncHandler(async (req, res) => {
  if (![ROLES.TEAM_LEADER, ROLES.TUTOR, ROLES.CODER].includes(req.user.role)) {
    throw new ApiError('Access denied', 403);
  }

  const sessionId = req.query.session_id ? Number(req.query.session_id) : undefined;
  const coderId = req.query.coder_id ? Number(req.query.coder_id) : undefined;
  const tutorId = req.query.tutor_id ? Number(req.query.tutor_id) : undefined;

  if (sessionId !== undefined && (!Number.isInteger(sessionId) || sessionId <= 0)) {
    throw new ApiError('session_id must be a positive integer', 400);
  }

  const observations = await observationsService.findAll({
    role: req.user.role,
    userId: req.user.id,
    sessionId,
    coderId: req.user.role === ROLES.TEAM_LEADER ? coderId : undefined,
    tutorId: req.user.role === ROLES.TEAM_LEADER ? tutorId : undefined,
  });

  return ApiResponse.success(res, observations);
});
