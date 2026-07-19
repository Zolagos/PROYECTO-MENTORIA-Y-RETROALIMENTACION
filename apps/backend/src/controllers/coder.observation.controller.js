import pool from '../config/database.js';
import * as coderObservationModel from '../models/coder.observation.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

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

export const listObservations = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  if (!user) {
    throw new ApiError('User not found', 401);
  }

  let { coder_id } = req.query;

  if (user.role === 'Coder') {
    coder_id = user.id;
  } else if (user.role !== 'Tutor' && user.role !== 'Team Leader') {
    throw new ApiError('Access denied', 403);
  }

  const observations = await coderObservationModel.findAll({ coder_id });

  res.status(200).json({ status: 'success', data: observations });
});

export const getObservation = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  if (!user) {
    throw new ApiError('User not found', 401);
  }

  if (user.role !== 'Tutor' && user.role !== 'Team Leader' && user.role !== 'Coder') {
    throw new ApiError('Access denied', 403);
  }

  const { id } = req.params;
  const observation = await coderObservationModel.findById(id);

  if (!observation) {
    throw new ApiError('Observation not found', 404);
  }

  if (user.role === 'Coder' && observation.coder_id !== user.id) {
    throw new ApiError('Access denied', 403);
  }

  res.status(200).json({ status: 'success', data: observation });
});

export const createObservation = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  if (!user) {
    throw new ApiError('User not found', 401);
  }

  if (user.role !== 'Tutor' && user.role !== 'Team Leader') {
    throw new ApiError('Only Tutors and Team Leaders can create observations', 403);
  }

  const { coder_id, session_id, observation, recommendation } = req.body;

  if (!coder_id || !Number.isInteger(coder_id)) {
    throw new ApiError('coder_id is required and must be an integer', 400);
  }

  if (!observation || typeof observation !== 'string' || observation.trim().length === 0) {
    throw new ApiError('observation is required and must be a non-empty string', 400);
  }

  if (session_id !== undefined && session_id !== null && !Number.isInteger(session_id)) {
    throw new ApiError('session_id must be an integer', 400);
  }

  if (recommendation !== undefined && recommendation !== null && typeof recommendation !== 'string') {
    throw new ApiError('recommendation must be a string', 400);
  }

  let newObservation;
  try {
    newObservation = await coderObservationModel.create({
      coder_id,
      observed_by: user.id,
      session_id: session_id || null,
      observation: observation.trim(),
      recommendation: recommendation?.trim() || null,
    });
  } catch (error) {
    if (error.code === '23503') {
      throw new ApiError('Invalid coder_id or session_id', 400);
    }
    throw error;
  }

  res.status(201).json({ status: 'success', data: newObservation });
});

export const updateObservation = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  if (!user) {
    throw new ApiError('User not found', 401);
  }

  if (user.role !== 'Tutor' && user.role !== 'Team Leader') {
    throw new ApiError('Only Tutors and Team Leaders can edit observations', 403);
  }

  const { id } = req.params;
  const existing = await coderObservationModel.findById(id);

  if (!existing) {
    throw new ApiError('Observation not found', 404);
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

  res.status(200).json({ status: 'success', data: updated });
});

export const deleteObservation = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  if (!user) {
    throw new ApiError('User not found', 401);
  }

  if (user.role !== 'Team Leader') {
    throw new ApiError('Only Team Leaders can delete observations', 403);
  }

  const { id } = req.params;
  const existing = await coderObservationModel.findById(id);

  if (!existing) {
    throw new ApiError('Observation not found', 404);
  }

  await coderObservationModel.remove(id);

  res.status(200).json({ status: 'success', message: 'Observation deleted' });
});
