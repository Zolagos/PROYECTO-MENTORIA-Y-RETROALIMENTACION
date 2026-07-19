import pool from '../config/database.js';
import * as sessionFeedbackModel from '../models/session.feedback.model.js';

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

export const getSessionFeedback = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    if (user.role !== 'Coder' && user.role !== 'Team Leader') {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    const sessionId = parseInt(req.params.sessionId, 10);

    if (!Number.isInteger(sessionId)) {
      return res.status(400).json({ status: 'error', message: 'sessionId must be an integer' });
    }

    if (user.role === 'Coder') {
      const { rows: coderSessions } = await pool.query(
        `SELECT 1 FROM session_coders WHERE session_id = $1 AND coder_id = $2`,
        [sessionId, user.id]
      );

      if (coderSessions.length === 0) {
        return res.status(403).json({ status: 'error', message: 'You are not part of this session' });
      }
    }

    const coderId = user.role === 'Coder' ? user.id : req.query.coder_id;

    if (!coderId) {
      return res.status(400).json({ status: 'error', message: 'coder_id is required for Team Leaders' });
    }

    const feedback = await sessionFeedbackModel.findBySessionAndCoder(sessionId, coderId);

    res.status(200).json({ status: 'success', data: feedback });
  } catch (error) {
    console.error('Error getting session feedback:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const createSessionFeedback = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    if (user.role !== 'Coder') {
      return res.status(403).json({ status: 'error', message: 'Only coders can submit feedback' });
    }

    const sessionId = parseInt(req.params.sessionId, 10);

    if (!Number.isInteger(sessionId)) {
      return res.status(400).json({ status: 'error', message: 'sessionId must be an integer' });
    }

    const { rows: sessions } = await pool.query(
      `SELECT id, status FROM mentoring_sessions WHERE id = $1`,
      [sessionId]
    );

    if (sessions.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Session not found' });
    }

    if (sessions[0].status !== 'completed') {
      return res.status(400).json({ status: 'error', message: 'Feedback can only be submitted for completed sessions' });
    }

    const { rows: coderSessions } = await pool.query(
      `SELECT 1 FROM session_coders WHERE session_id = $1 AND coder_id = $2`,
      [sessionId, user.id]
    );

    if (coderSessions.length === 0) {
      return res.status(403).json({ status: 'error', message: 'You are not part of this session' });
    }

    const { tutor_rating, session_rating, comments } = req.body;

    if (!Number.isInteger(tutor_rating) || tutor_rating < 1 || tutor_rating > 5) {
      return res.status(400).json({ status: 'error', message: 'tutor_rating is required and must be an integer between 1 and 5' });
    }

    if (!Number.isInteger(session_rating) || session_rating < 1 || session_rating > 5) {
      return res.status(400).json({ status: 'error', message: 'session_rating is required and must be an integer between 1 and 5' });
    }

    if (comments !== undefined && comments !== null && typeof comments !== 'string') {
      return res.status(400).json({ status: 'error', message: 'comments must be a string' });
    }

    const feedback = await sessionFeedbackModel.create({
      sessionId,
      coderId: user.id,
      tutorRating: tutor_rating,
      sessionRating: session_rating,
      comments: comments?.trim() || null,
    });

    res.status(201).json({ status: 'success', data: feedback });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ status: 'error', message: 'You have already submitted feedback for this session' });
    }
    if (error.code === '23503') {
      return res.status(400).json({ status: 'error', message: 'Invalid session_id or coder_id' });
    }
    console.error('Error creating session feedback:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
