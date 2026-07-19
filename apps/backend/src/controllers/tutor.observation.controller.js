import pool from '../config/database.js';
import * as tutorObservationModel from '../models/tutor.observation.model.js';
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

  let { tutor_id } = req.query;

  if (user.role === 'Tutor') {
    tutor_id = user.id;
  } else if (user.role !== 'Team Leader') {
    throw new ApiError('Access denied', 403);
  }

  const observations = await tutorObservationModel.findAll({ tutor_id });

  res.status(200).json({ status: 'success', data: observations });
});

export const getObservation = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  if (!user) {
    throw new ApiError('User not found', 401);
  }

  if (user.role !== 'Team Leader' && user.role !== 'Tutor') {
    throw new ApiError('Access denied', 403);
  }

  const { id } = req.params;
  const observation = await tutorObservationModel.findById(id);

  if (!observation) {
    throw new ApiError('Observation not found', 404);
  }

  if (user.role === 'Tutor' && observation.tutor_id !== user.id) {
    throw new ApiError('Access denied', 403);
  }

  res.status(200).json({ status: 'success', data: observation });
});

export const createObservation = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  if (!user) {
    throw new ApiError('User not found', 401);
  }

  if (user.role !== 'Team Leader') {
    throw new ApiError('Only Team Leaders can create tutor observations', 403);
  }

  const { tutor_id, session_id, observation, recommendation, technical_notes } = req.body;

  if (!tutor_id || !Number.isInteger(tutor_id)) {
    throw new ApiError('tutor_id is required and must be an integer', 400);
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

  if (technical_notes !== undefined && technical_notes !== null && typeof technical_notes !== 'string') {
    throw new ApiError('technical_notes must be a string', 400);
  }

  let newObservation;
  try {
    newObservation = await tutorObservationModel.create({
      tutor_id,
      observed_by: user.id,
      session_id: session_id || null,
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

  res.status(201).json({ status: 'success', data: newObservation });
});

export const updateObservation = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  if (!user) {
    throw new ApiError('User not found', 401);
  }

  if (user.role !== 'Team Leader') {
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

  res.status(200).json({ status: 'success', data: updated });
});

export const deleteObservation = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  if (!user) {
    throw new ApiError('User not found', 401);
  }

  if (user.role !== 'Team Leader') {
    throw new ApiError('Only Team Leaders can delete tutor observations', 403);
  }

  const { id } = req.params;
  const existing = await tutorObservationModel.findById(id);

  if (!existing) {
    throw new ApiError('Observation not found', 404);
  }

  await tutorObservationModel.remove(id);

  res.status(200).json({ status: 'success', message: 'Observation deleted' });
});
