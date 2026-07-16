import pool from '../config/database.js';

export const findAll = async ({ coder_id } = {}) => {
  let query = `
    SELECT co.*,
           u_coder.name AS coder_name, u_coder.lastname AS coder_lastname,
           u_observer.name AS observer_name, u_observer.lastname AS observer_lastname,
           ms.topic AS session_topic
    FROM coder_observations co
    JOIN users u_coder ON co.coder_id = u_coder.id
    JOIN users u_observer ON co.observed_by = u_observer.id
    LEFT JOIN mentoring_sessions ms ON co.session_id = ms.id
  `;
  const params = [];

  if (coder_id) {
    params.push(coder_id);
    query += ` WHERE co.coder_id = $1`;
  }

  query += ` ORDER BY co.created_at DESC`;

  const { rows } = await pool.query(query, params);
  return rows;
};

export const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT co.*,
            u_coder.name AS coder_name, u_coder.lastname AS coder_lastname,
            u_observer.name AS observer_name, u_observer.lastname AS observer_lastname,
            ms.topic AS session_topic
     FROM coder_observations co
     JOIN users u_coder ON co.coder_id = u_coder.id
     JOIN users u_observer ON co.observed_by = u_observer.id
     LEFT JOIN mentoring_sessions ms ON co.session_id = ms.id
     WHERE co.id = $1`,
    [id]
  );
  return rows[0] || null;
};

export const create = async ({ coder_id, observed_by, session_id, observation, recommendation }) => {
  const { rows } = await pool.query(
    `INSERT INTO coder_observations (coder_id, observed_by, session_id, observation, recommendation)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [coder_id, observed_by, session_id || null, observation, recommendation || null]
  );
  return rows[0];
};

export const update = async (id, { observation, recommendation }) => {
  const { rows } = await pool.query(
    `UPDATE coder_observations
     SET observation = $1, recommendation = $2, updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING *`,
    [observation, recommendation || null, id]
  );
  return rows[0] || null;
};

export const remove = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM coder_observations
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return rows[0] || null;
};
