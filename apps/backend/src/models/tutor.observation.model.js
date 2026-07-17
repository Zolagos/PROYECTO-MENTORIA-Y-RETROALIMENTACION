import pool from '../config/database.js';

export const findAll = async ({ tutor_id } = {}) => {
  let query = `
    SELECT tobs.*,
           u_tutor.name AS tutor_name, u_tutor.lastname AS tutor_lastname,
           u_observer.name AS observer_name, u_observer.lastname AS observer_lastname,
           ms.topic AS session_topic
    FROM tutor_observations tobs
    JOIN users u_tutor ON tobs.tutor_id = u_tutor.id
    JOIN users u_observer ON tobs.observed_by = u_observer.id
    LEFT JOIN mentoring_sessions ms ON tobs.session_id = ms.id
  `;
  const params = [];

  if (tutor_id) {
    params.push(tutor_id);
    query += ` WHERE tobs.tutor_id = $1`;
  }

  query += ` ORDER BY tobs.created_at DESC`;

  const { rows } = await pool.query(query, params);
  return rows;
};

export const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT tobs.*,
            u_tutor.name AS tutor_name, u_tutor.lastname AS tutor_lastname,
            u_observer.name AS observer_name, u_observer.lastname AS observer_lastname,
            ms.topic AS session_topic
     FROM tutor_observations tobs
     JOIN users u_tutor ON tobs.tutor_id = u_tutor.id
     JOIN users u_observer ON tobs.observed_by = u_observer.id
     LEFT JOIN mentoring_sessions ms ON tobs.session_id = ms.id
     WHERE tobs.id = $1`,
    [id]
  );
  return rows[0] || null;
};

export const create = async ({ tutor_id, observed_by, session_id, observation, recommendation, technical_notes }) => {
  const { rows } = await pool.query(
    `INSERT INTO tutor_observations (tutor_id, observed_by, session_id, observation, recommendation, technical_notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [tutor_id, observed_by, session_id || null, observation, recommendation || null, technical_notes || null]
  );
  return rows[0];
};

export const update = async (id, { observation, recommendation, technical_notes }) => {
  const { rows } = await pool.query(
    `UPDATE tutor_observations
     SET observation = $1, recommendation = $2, technical_notes = $3, updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING *`,
    [observation, recommendation || null, technical_notes || null, id]
  );
  return rows[0] || null;
};

export const remove = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM tutor_observations
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return rows[0] || null;
};
