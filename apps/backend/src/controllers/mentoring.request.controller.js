import pool from '../config/database.js';
import * as mentoringRequestModel from '../models/mentoring.request.model.js';

export const listMentoringRequests = async (req, res) => {
  try {
    const { id } = req.user;

    const { rows: users } = await pool.query(
      `SELECT u.id, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [id]
    );

    if (users.length === 0) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    const user = users[0];
    let { coder_id } = req.query;

    if (user.role === 'Coder') {
      coder_id = user.id;
    } else if (user.role === 'Team Leader') {
      coder_id = coder_id ? Number(coder_id) : undefined;
    } else {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    const requests = await mentoringRequestModel.findAll({ coder_id });

    res.status(200).json({ status: 'success', data: requests });
  } catch (error) {
    console.error('Error listing mentoring requests:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getMentoringRequest = async (req, res) => {
  try {
    const { id } = req.user;

    const { rows: users } = await pool.query(
      `SELECT u.id, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [id]
    );

    if (users.length === 0) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    const user = users[0];

    if (user.role !== 'Coder' && user.role !== 'Team Leader') {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    const { id } = req.params;
    const request = await mentoringRequestModel.findById(id);

    if (!request) {
      return res.status(404).json({ status: 'error', message: 'Mentoring request not found' });
    }

    if (user.role === 'Coder' && request.coder_id !== user.id) {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    res.status(200).json({ status: 'success', data: request });
  } catch (error) {
    console.error('Error getting mentoring request:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const createMentoringRequest = async (req, res) => {
  try {
    const { id } = req.user;
    //Obtiene el id del usuario autenticado (payload del JWT)

    const { rows: users } = await pool.query(
      `SELECT u.id, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [id]
    );

    if (users.length === 0) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    const user = users[0];

    if (user.role !== 'Coder') {
      return res.status(403).json({ status: 'error', message: 'Only coders can create mentoring requests' });
    }

    let { topic, description } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ status: 'error', message: 'topic is required and must be a non-empty string' });
    }

    if (topic.length > 200) {
      return res.status(400).json({ status: 'error', message: 'topic must not exceed 200 characters' });
    }

    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({ status: 'error', message: 'description must be a string' });
    }

    if (description && description.length > 1000) {
      return res.status(400).json({ status: 'error', message: 'description must not exceed 1000 characters' });
    }

    const mentoringRequest = await mentoringRequestModel.createRequest({ coder_id: user.id, topic: topic.trim(), description: description?.trim() });
    res.status(201).json({ status: 'success', data: mentoringRequest });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).json({ status: 'error', message: 'coder_id does not reference an existing user' });
    }
    console.error('Error creating mentoring request:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
