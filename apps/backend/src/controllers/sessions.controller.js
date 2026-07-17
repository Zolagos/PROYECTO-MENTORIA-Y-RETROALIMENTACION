import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import * as sessionsService from '../services/sessions.service.js';

export const assignParticipants = asyncHandler(async (req, res) => {
  const sessionId = Number(req.params.id);
  const { tutorId, coderIds } = req.body;

  if (!Number.isInteger(sessionId)) throw new ApiError('Invalid session id', 400);
  if (!Number.isInteger(tutorId)) throw new ApiError('tutorId is required', 400);
  if (!Array.isArray(coderIds) || coderIds.length === 0) {
    throw new ApiError('coderIds must be a non-empty array', 400);
  }

  const session = await sessionsService.assignParticipants({
    sessionId,
    tutorId,
    coderIds,
  });

  return ApiResponse.success(res, session, 'Participants assigned');
});
