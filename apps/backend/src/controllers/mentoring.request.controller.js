import pool from '../config/database.js';
import { createRequest } from '../models/mentoring.request.model.js';

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

    const mentoringRequest = await createRequest({ coder_id: user.id, topic: topic.trim(), description: description?.trim() });
    //coder_id se obtiene automáticamente del usuario autenticado vía JWT → id → consulta DB → user.id.
    res.status(201).json({ status: 'success', data: mentoringRequest });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).json({ status: 'error', message: 'coder_id does not reference an existing user' });
    }
    console.error('Error creating mentoring request:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
