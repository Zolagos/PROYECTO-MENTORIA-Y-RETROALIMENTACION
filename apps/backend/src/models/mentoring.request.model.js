import pool from '../config/database.js';

export const createRequest = async ({ coder_id, topic, description }) => {
  const { rows } = await pool.query(
    `INSERT INTO mentoring_requests (coder_id, topic, description)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [coder_id, topic, description || null]
  );
  return rows[0];
};
