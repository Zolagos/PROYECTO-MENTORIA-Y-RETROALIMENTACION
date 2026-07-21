import pool from '../config/database.js';

export const findBySessionAndCoder = async (sessionId, coderId) => {
  const { rows } = await pool.query(
    `SELECT sf.*,
            ms.topic AS session_topic,
            u.name AS tutor_name, u.lastname AS tutor_lastname
     FROM session_feedback sf
     JOIN mentoring_sessions ms ON sf.session_id = ms.id
     LEFT JOIN users u ON ms.tutor_id = u.id
     WHERE sf.session_id = $1 AND sf.coder_id = $2`,
    [sessionId, coderId]
  );
  return rows[0] || null;
};

export const create = async ({ sessionId, coderId, tutorRating, sessionRating, comments }) => {
  const { rows } = await pool.query(
    `INSERT INTO session_feedback (session_id, coder_id, tutor_rating, session_rating, comments)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [sessionId, coderId, tutorRating, sessionRating, comments || null]
  );
  return rows[0];
};
