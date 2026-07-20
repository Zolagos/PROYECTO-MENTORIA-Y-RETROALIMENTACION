import pool from '../config/database.js';

export const findAll = async ({ coder_id } = {}) => {
  let query = `
    SELECT mr.*,
           u.name AS coder_name,
           u.lastname AS coder_lastname
    FROM mentoring_requests mr
    JOIN users u ON mr.coder_id = u.id
  `;
  const params = [];

  if (coder_id) {
    params.push(coder_id);
    query += ` WHERE mr.coder_id = $1`;
  }

  query += ` ORDER BY mr.request_date DESC`;

  const { rows } = await pool.query(query, params);
  return rows;
};

export const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT mr.*,
            u.name AS coder_name,
            u.lastname AS coder_lastname
     FROM mentoring_requests mr
     JOIN users u ON mr.coder_id = u.id
     WHERE mr.id = $1`,
    [id]
  );
  return rows[0] || null;
};

export const createRequest = async ({ coder_id, topic, description }) => {
  const { rows } = await pool.query(
    `INSERT INTO mentoring_requests (coder_id, topic, description)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [coder_id, topic, description || null]
  );
  return rows[0];
};

export const updateMentoringRequest = async ({mentoring_id, mentoring_status }) => {
  const { rows } = await pool.query(
    `UPDATE mentoring_requests
    SET state = $1
    WHERE id = $2
    RETURNING *`,
    [mentoring_status, mentoring_id]
  );
  return rows[0];
};

export const deleteMentoring = async ({ mentoring_id }) => {
  const { rows } = await pool.query(
    `DELETE FROM mentoring_requests
    WHERE id = $1
    RETURNING *`,
    [mentoring_id]
  );
  return rows[0];
};