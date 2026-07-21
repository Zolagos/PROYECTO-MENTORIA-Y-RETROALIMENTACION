import * as coderObservationModel from '../models/coder.observation.model.js';
import * as usersRepository from '../repositories/users.repository.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { ROLES } from '../config/roles.js';

export const listObservations = asyncHandler(async (req, res) => {
  let coder_id = req.query.coder_id ? Number(req.query.coder_id) : undefined;
  let clan_id;

  if (req.user.role === ROLES.CODER) {
    coder_id = req.user.id;
  } else if (req.user.role === ROLES.TUTOR || req.user.role === ROLES.TEAM_LEADER) {
    clan_id = req.user.clanId;
  } else {
    throw new ApiError('Access denied', 403);
  }

  const observations = await coderObservationModel.findAll({ coder_id, clan_id });

  return ApiResponse.success(res, observations);
});

export const getObservation = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.TUTOR && req.user.role !== ROLES.TEAM_LEADER && req.user.role !== ROLES.CODER) {
    throw new ApiError('Access denied', 403);
  }

  const { id } = req.params;
  const observation = await coderObservationModel.findById(id);

  if (!observation) {
    throw new ApiError('Observation not found', 404);
  }

  if (req.user.role === ROLES.CODER && observation.coder_id !== req.user.id) {
    throw new ApiError('Access denied', 403);
  }

  if (
    (req.user.role === ROLES.TUTOR || req.user.role === ROLES.TEAM_LEADER) &&
    Number(observation.coder_clan_id) !== Number(req.user.clanId)
  ) {
    throw new ApiError('Access denied', 403);
  }

  return ApiResponse.success(res, observation);
});

export const createObservation = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.TUTOR && req.user.role !== ROLES.TEAM_LEADER) {
    throw new ApiError('Only Tutors and Team Leaders can create observations', 403);
  }

  const { coder_id, session_id, observation, recommendation } = req.body;

  const parsedCoderId = Number(coder_id);
  if (!Number.isInteger(parsedCoderId) || parsedCoderId <= 0) {
    throw new ApiError('coder_id is required and must be a positive integer', 400);
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

  const targetCoder = await usersRepository.findById(parsedCoderId);
  if (!targetCoder || targetCoder.role !== ROLES.CODER) {
    throw new ApiError('coder_id does not reference an existing coder', 404);
  }
  if (Number(targetCoder.clan_id) !== Number(req.user.clanId)) {
    throw new ApiError('The coder must belong to your own clan', 403);
  }

  let newObservation;
  try {
    newObservation = await coderObservationModel.create({
      coder_id: parsedCoderId,
      observed_by: req.user.id,
      session_id: parsedSessionId || null,
      observation: observation.trim(),
      recommendation: recommendation?.trim() || null,
    });
  } catch (error) {
    if (error.code === '23503') {
      throw new ApiError('Invalid coder_id or session_id', 400);
    }
    throw error;
  }

  return ApiResponse.created(res, newObservation);
});

export const updateObservation = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.TUTOR && req.user.role !== ROLES.TEAM_LEADER) {
    throw new ApiError('Only Tutors and Team Leaders can edit observations', 403);
  }

  const { id } = req.params;
  const existing = await coderObservationModel.findById(id);

  if (!existing) {
    throw new ApiError('Observation not found', 404);
  }

  if (Number(existing.coder_clan_id) !== Number(req.user.clanId)) {
    throw new ApiError('You can only edit observations for coders in your own clan', 403);
  }

  const { observation, recommendation } = req.body;

  if (!observation || typeof observation !== 'string' || observation.trim().length === 0) {
    throw new ApiError('observation is required and must be a non-empty string', 400);
  }

  if (recommendation !== undefined && recommendation !== null && typeof recommendation !== 'string') {
    throw new ApiError('recommendation must be a string', 400);
  }

  const updated = await coderObservationModel.update(id, {
    observation: observation.trim(),
    recommendation: recommendation?.trim() || null,
  });

  return ApiResponse.success(res, updated);
});

export const deleteObservation = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.TEAM_LEADER) {
    throw new ApiError('Only Team Leaders can delete observations', 403);
  }

  const { id } = req.params;
  const existing = await coderObservationModel.findById(id);

  if (!existing) {
    throw new ApiError('Observation not found', 404);
  }

  if (Number(existing.coder_clan_id) !== Number(req.user.clanId)) {
    throw new ApiError('You can only delete observations for coders in your own clan', 403);
  }

  const deleted = await coderObservationModel.remove(id);
  if (!deleted) {
    throw new ApiError('Observation not found', 404);
  }

  return ApiResponse.success(res, null, 'Observation deleted');
});
