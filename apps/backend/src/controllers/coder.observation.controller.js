import pool from '../config/database.js';
import * as coderObservationModel from '../models/coder.observation.model.js';

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

    let { coder_id } = req.query;

    if (user.role === 'Coder') {
      coder_id = user.id;
    } else if (user.role !== 'Tutor' && user.role !== 'Team Leader') {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    const observations = await coderObservationModel.findAll({ coder_id });

    res.status(200).json({ status: 'success', data: observations });
  } catch (error) {
    console.error('Error listing coder observations:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getObservation = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    if (user.role !== 'Tutor' && user.role !== 'Team Leader' && user.role !== 'Coder') {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    const { id } = req.params;
    const observation = await coderObservationModel.findById(id);

    if (!observation) {
      return res.status(404).json({ status: 'error', message: 'Observation not found' });
    }

    if (user.role === 'Coder' && observation.coder_id !== user.id) {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    res.status(200).json({ status: 'success', data: observation });
  } catch (error) {
    console.error('Error getting coder observation:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const createObservation = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    if (user.role !== 'Tutor' && user.role !== 'Team Leader') {
      return res.status(403).json({ status: 'error', message: 'Only Tutors and Team Leaders can create observations' });
    }

    const { coder_id, session_id, observation, recommendation } = req.body;

    if (!coder_id || !Number.isInteger(coder_id)) {
      return res.status(400).json({ status: 'error', message: 'coder_id is required and must be an integer' });
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

    const newObservation = await coderObservationModel.create({
      coder_id,
      observed_by: user.id,
      session_id: session_id || null,
      observation: observation.trim(),
      recommendation: recommendation?.trim() || null,
    });

    res.status(201).json({ status: 'success', data: newObservation });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).json({ status: 'error', message: 'Invalid coder_id or session_id' });
    }
    console.error('Error creating coder observation:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateObservation = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    if (user.role !== 'Tutor' && user.role !== 'Team Leader') {
      return res.status(403).json({ status: 'error', message: 'Only Tutors and Team Leaders can edit observations' });
    }

    const { id } = req.params;
    const existing = await coderObservationModel.findById(id);

    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Observation not found' });
    }

    const { observation, recommendation } = req.body;

    if (!observation || typeof observation !== 'string' || observation.trim().length === 0) {
      return res.status(400).json({ status: 'error', message: 'observation is required and must be a non-empty string' });
    }

    if (recommendation !== undefined && recommendation !== null && typeof recommendation !== 'string') {
      return res.status(400).json({ status: 'error', message: 'recommendation must be a string' });
    }

    const updated = await coderObservationModel.update(id, {
      observation: observation.trim(),
      recommendation: recommendation?.trim() || null,
    });

    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Error updating coder observation:', error);
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
      return res.status(403).json({ status: 'error', message: 'Only Team Leaders can delete observations' });
    }

    const { id } = req.params;
    const existing = await coderObservationModel.findById(id);

    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Observation not found' });
    }

    await coderObservationModel.remove(id);

    res.status(200).json({ status: 'success', message: 'Observation deleted' });
  } catch (error) {
    console.error('Error deleting coder observation:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
