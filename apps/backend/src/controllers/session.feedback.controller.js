import pool from '../config/database.js';
import * as sessionFeedbackModel from '../models/session.feedback.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

const getUserById = async (id) => {
  const { rows } = await pool.query(
    `SELECT u.id, r.name AS role
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.id = $1`,
    [id]
  );
  return rows[0] || null;
};

export const getSessionFeedback = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  if (!user) {
    throw new ApiError('User not found', 401);
  }

  if (user.role !== 'Coder' && user.role !== 'Team Leader') {
    throw new ApiError('Access denied', 403);
  }

  const sessionId = parseInt(req.params.sessionId, 10);

  if (!Number.isInteger(sessionId)) {
    throw new ApiError('sessionId must be an integer', 400);
  }

  if (user.role === 'Coder') {
    const { rows: coderSessions } = await pool.query(
      `SELECT 1 FROM session_coders WHERE session_id = $1 AND coder_id = $2`,
      [sessionId, user.id]
    );

    if (coderSessions.length === 0) {
      throw new ApiError('You are not part of this session', 403);
    }
  }

  const coderId = user.role === 'Coder' ? user.id : Number(req.query.coder_id);

  if (!Number.isInteger(coderId) || coderId <= 0) {
    throw new ApiError('coder_id is required and must be a positive integer for Team Leaders', 400);
  }

  const feedback = await sessionFeedbackModel.findBySessionAndCoder(sessionId, coderId);

  return ApiResponse.success(res, feedback);
});

export const createSessionFeedback = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  if (!user) {
    throw new ApiError('User not found', 401);
  }

  if (user.role !== 'Coder') {
    throw new ApiError('Only coders can submit feedback', 403);
  }

  const sessionId = parseInt(req.params.sessionId, 10);

  if (!Number.isInteger(sessionId)) {
    throw new ApiError('sessionId must be an integer', 400);
  }

  const { rows: sessions } = await pool.query(
    `SELECT id, status FROM mentoring_sessions WHERE id = $1`,
    [sessionId]
  );

  if (sessions.length === 0) {
    throw new ApiError('Session not found', 404);
  }

  if (sessions[0].status !== 'completed') {
    throw new ApiError('Feedback can only be submitted for completed sessions', 400);
  }

  const { rows: coderSessions } = await pool.query(
    `SELECT 1 FROM session_coders WHERE session_id = $1 AND coder_id = $2`,
    [sessionId, user.id]
  );

  if (coderSessions.length === 0) {
    throw new ApiError('You are not part of this session', 403);
  }

  const { tutor_rating, session_rating, comments } = req.body;

  if (!Number.isInteger(tutor_rating) || tutor_rating < 1 || tutor_rating > 5) {
    throw new ApiError('tutor_rating is required and must be an integer between 1 and 5', 400);
  }

  if (!Number.isInteger(session_rating) || session_rating < 1 || session_rating > 5) {
    throw new ApiError('session_rating is required and must be an integer between 1 and 5', 400);
  }

  if (comments !== undefined && comments !== null && typeof comments !== 'string') {
    throw new ApiError('comments must be a string', 400);
  }

  let feedback;
  try {
    feedback = await sessionFeedbackModel.create({
      sessionId,
      coderId: user.id,
      tutorRating: tutor_rating,
      sessionRating: session_rating,
      comments: comments?.trim() || null,
    });
  } catch (error) {
    if (error.code === '23505') {
      throw new ApiError('You have already submitted feedback for this session', 409);
    }
    if (error.code === '23503') {
      throw new ApiError('Invalid session_id or coder_id', 400);
    }
    throw error;
  }

  return ApiResponse.created(res, feedback);
});
