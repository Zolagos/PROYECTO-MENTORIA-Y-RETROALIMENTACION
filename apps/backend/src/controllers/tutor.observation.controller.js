import * as tutorObservationModel from '../models/tutor.observation.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { ROLES } from '../config/roles.js';

export const listObservations = asyncHandler(async (req, res) => {
  let tutor_id = req.query.tutor_id ? Number(req.query.tutor_id) : undefined;

  if (req.user.role === ROLES.TUTOR) {
    tutor_id = req.user.id;
  } else if (req.user.role !== ROLES.TEAM_LEADER) {
    throw new ApiError('Access denied', 403);
  }

  const observations = await tutorObservationModel.findAll({ tutor_id });

  return ApiResponse.success(res, observations);
});

export const getObservation = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.TEAM_LEADER && req.user.role !== ROLES.TUTOR) {
    throw new ApiError('Access denied', 403);
  }

  const { id } = req.params;
  const observation = await tutorObservationModel.findById(id);

  if (!observation) {
    throw new ApiError('Observation not found', 404);
  }

  if (req.user.role === ROLES.TUTOR && observation.tutor_id !== req.user.id) {
    throw new ApiError('Access denied', 403);
  }

  return ApiResponse.success(res, observation);
});

export const createObservation = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.TEAM_LEADER) {
    throw new ApiError('Only Team Leaders can create tutor observations', 403);
  }

  const { tutor_id, session_id, observation, recommendation, technical_notes } = req.body;

  const parsedTutorId = Number(tutor_id);
  if (!Number.isInteger(parsedTutorId) || parsedTutorId <= 0) {
    throw new ApiError('tutor_id is required and must be a positive integer', 400);
  }

  if (!observation || typeof observation !== 'string' || observation.trim().length === 0) {
    throw new ApiError('observation is required and must be a non-empty string', 400);
  }

  let parsedSessionId;
  if (session_id !== undefined && session_id !== null) {
    parsedSessionId = Number(session_id);
    if (!Number.isInteger(parsedSessionId) || parsedSessionId <= 0) {
      throw new ApiError('session_id must be a positive integer', 400);
    }
  }

  if (recommendation !== undefined && recommendation !== null && typeof recommendation !== 'string') {
    throw new ApiError('recommendation must be a string', 400);
  }

  if (technical_notes !== undefined && technical_notes !== null && typeof technical_notes !== 'string') {
    throw new ApiError('technical_notes must be a string', 400);
  }

  let newObservation;
  try {
    newObservation = await tutorObservationModel.create({
      tutor_id: parsedTutorId,
      observed_by: req.user.id,
      session_id: parsedSessionId || null,
      observation: observation.trim(),
      recommendation: recommendation?.trim() || null,
      technical_notes: technical_notes?.trim() || null,
    });
  } catch (error) {
    if (error.code === '23503') {
      throw new ApiError('Invalid tutor_id or session_id', 400);
    }
    throw error;
  }

  return ApiResponse.created(res, newObservation);
});

export const updateObservation = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.TEAM_LEADER) {
    throw new ApiError('Only Team Leaders can edit tutor observations', 403);
  }

  const { id } = req.params;
  const existing = await tutorObservationModel.findById(id);

  if (!existing) {
    throw new ApiError('Observation not found', 404);
  }

  const { observation, recommendation, technical_notes } = req.body;

  if (!observation || typeof observation !== 'string' || observation.trim().length === 0) {
    throw new ApiError('observation is required and must be a non-empty string', 400);
  }

  if (recommendation !== undefined && recommendation !== null && typeof recommendation !== 'string') {
    throw new ApiError('recommendation must be a string', 400);
  }

  if (technical_notes !== undefined && technical_notes !== null && typeof technical_notes !== 'string') {
    throw new ApiError('technical_notes must be a string', 400);
  }

  const updated = await tutorObservationModel.update(id, {
    observation: observation.trim(),
    recommendation: recommendation?.trim() || null,
    technical_notes: technical_notes?.trim() || null,
  });

  return ApiResponse.success(res, updated);
});

export const deleteObservation = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.TEAM_LEADER) {
    throw new ApiError('Only Team Leaders can delete tutor observations', 403);
  }

  const { id } = req.params;
  const existing = await tutorObservationModel.findById(id);

  if (!existing) {
    throw new ApiError('Observation not found', 404);
  }

  const deleted = await tutorObservationModel.remove(id);
  if (!deleted) {
    throw new ApiError('Observation not found', 404);
  }

  return ApiResponse.success(res, null, 'Observation deleted');
});
