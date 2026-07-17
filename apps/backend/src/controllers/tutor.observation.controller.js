import pool from '../config/database.js';
import * as tutorObservationModel from '../models/tutor.observation.model.js';

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

export const listObservations = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    let { tutor_id } = req.query;

    if (user.role === 'Tutor') {
      tutor_id = user.id;
    } else if (user.role !== 'Team Leader') {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    const observations = await tutorObservationModel.findAll({ tutor_id });

    res.status(200).json({ status: 'success', data: observations });
  } catch (error) {
    console.error('Error listing tutor observations:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getObservation = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    if (user.role !== 'Team Leader' && user.role !== 'Tutor') {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    const { id } = req.params;
    const observation = await tutorObservationModel.findById(id);

    if (!observation) {
      return res.status(404).json({ status: 'error', message: 'Observation not found' });
    }

    if (user.role === 'Tutor' && observation.tutor_id !== user.id) {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    res.status(200).json({ status: 'success', data: observation });
  } catch (error) {
    console.error('Error getting tutor observation:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const createObservation = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    if (user.role !== 'Team Leader') {
      return res.status(403).json({ status: 'error', message: 'Only Team Leaders can create tutor observations' });
    }

    const { tutor_id, session_id, observation, recommendation, technical_notes } = req.body;

    if (!tutor_id || !Number.isInteger(tutor_id)) {
      return res.status(400).json({ status: 'error', message: 'tutor_id is required and must be an integer' });
    }

    if (!observation || typeof observation !== 'string' || observation.trim().length === 0) {
      return res.status(400).json({ status: 'error', message: 'observation is required and must be a non-empty string' });
    }

    if (session_id !== undefined && session_id !== null && !Number.isInteger(session_id)) {
      return res.status(400).json({ status: 'error', message: 'session_id must be an integer' });
    }

    if (recommendation !== undefined && recommendation !== null && typeof recommendation !== 'string') {
      return res.status(400).json({ status: 'error', message: 'recommendation must be a string' });
    }

    if (technical_notes !== undefined && technical_notes !== null && typeof technical_notes !== 'string') {
      return res.status(400).json({ status: 'error', message: 'technical_notes must be a string' });
    }

    const newObservation = await tutorObservationModel.create({
      tutor_id,
      observed_by: user.id,
      session_id: session_id || null,
      observation: observation.trim(),
      recommendation: recommendation?.trim() || null,
      technical_notes: technical_notes?.trim() || null,
    });

    res.status(201).json({ status: 'success', data: newObservation });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).json({ status: 'error', message: 'Invalid tutor_id or session_id' });
    }
    console.error('Error creating tutor observation:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateObservation = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    if (user.role !== 'Team Leader') {
      return res.status(403).json({ status: 'error', message: 'Only Team Leaders can edit tutor observations' });
    }

    const { id } = req.params;
    const existing = await tutorObservationModel.findById(id);

    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Observation not found' });
    }

    const { observation, recommendation, technical_notes } = req.body;

    if (!observation || typeof observation !== 'string' || observation.trim().length === 0) {
      return res.status(400).json({ status: 'error', message: 'observation is required and must be a non-empty string' });
    }

    if (recommendation !== undefined && recommendation !== null && typeof recommendation !== 'string') {
      return res.status(400).json({ status: 'error', message: 'recommendation must be a string' });
    }

    if (technical_notes !== undefined && technical_notes !== null && typeof technical_notes !== 'string') {
      return res.status(400).json({ status: 'error', message: 'technical_notes must be a string' });
    }

    const updated = await tutorObservationModel.update(id, {
      observation: observation.trim(),
      recommendation: recommendation?.trim() || null,
      technical_notes: technical_notes?.trim() || null,
    });

    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Error updating tutor observation:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const deleteObservation = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    if (user.role !== 'Team Leader') {
      return res.status(403).json({ status: 'error', message: 'Only Team Leaders can delete tutor observations' });
    }

    const { id } = req.params;
    const existing = await tutorObservationModel.findById(id);

    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Observation not found' });
    }

    await tutorObservationModel.remove(id);

    res.status(200).json({ status: 'success', message: 'Observation deleted' });
  } catch (error) {
    console.error('Error deleting tutor observation:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
