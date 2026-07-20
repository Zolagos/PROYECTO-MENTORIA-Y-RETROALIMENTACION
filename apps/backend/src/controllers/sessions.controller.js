import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import * as sessionsService from '../services/sessions.service.js';

export const createSession = asyncHandler(async (req, res) => {
  const session = await sessionsService.createSession({
    sessionData: req.body,
    actor: req.user,
  });

  return ApiResponse.created(res, session);
});

export const assignParticipants = asyncHandler(
  async (req, res) => {
    const sessionId = Number(req.params.id);
    const { coderIds } = req.body;

    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      throw new ApiError('Invalid session id', 400);
    }

    if (
      Object.hasOwn(req.body, 'tutorId') ||
      Object.hasOwn(req.body, 'tutor_id')
    ) {
      throw new ApiError(
        'The session Tutor cannot be changed when assigning participants',
        400
      );
    }

    if (!Array.isArray(coderIds) || coderIds.length === 0) {
      throw new ApiError(
        'coderIds must be a non-empty array',
        400
      );
    }

    const session = await sessionsService.assignParticipants({
      sessionId,
      coderIds,
      actor: req.user,
    });

    return ApiResponse.success(
      res,
      session,
      'Participants assigned'
    );
  }
);
