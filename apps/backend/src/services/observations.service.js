import pool from '../config/database.js';

export const findAll = async ({ role, userId, sessionId, coderId, tutorId } = {}) => {
  const queries = [];
  const params = [];
  let idx = 0;
  const p = (val) => { idx++; params.push(val); return `$${idx}`; };

  if (role === 'Tutor') {
    queries.push(`
      (SELECT 'tutor' AS type, tobs.id, tobs.tutor_id AS target_id,
              u_tutor.name AS target_name, u_tutor.lastname AS target_lastname,
              tobs.observed_by,
              u_obs.name AS observer_name, u_obs.lastname AS observer_lastname,
              tobs.session_id, ms.topic AS session_topic,
              tobs.observation, tobs.recommendation, tobs.technical_notes,
              tobs.created_at
       FROM tutor_observations tobs
       JOIN users u_tutor ON tobs.tutor_id = u_tutor.id
       JOIN users u_obs ON tobs.observed_by = u_obs.id
       LEFT JOIN mentoring_sessions ms ON tobs.session_id = ms.id
       WHERE tobs.tutor_id = ${p(userId)}
       ${sessionId ? `AND tobs.session_id = ${p(sessionId)}` : ''})
    `);
  } else if (role === 'Coder') {
    queries.push(`
      (SELECT 'coder' AS type, co.id, co.coder_id AS target_id,
              u_coder.name AS target_name, u_coder.lastname AS target_lastname,
              co.observed_by,
              u_obs.name AS observer_name, u_obs.lastname AS observer_lastname,
              co.session_id, ms.topic AS session_topic,
              co.observation, co.recommendation, NULL AS technical_notes,
              co.created_at
       FROM coder_observations co
       JOIN users u_coder ON co.coder_id = u_coder.id
       JOIN users u_obs ON co.observed_by = u_obs.id
       LEFT JOIN mentoring_sessions ms ON co.session_id = ms.id
       WHERE co.coder_id = ${p(userId)}
       ${sessionId ? `AND co.session_id = ${p(sessionId)}` : ''})
    `);
  } else {
    const coderW = [];
    const tutorW = [];
    if (sessionId) { coderW.push(`co.session_id = ${p(sessionId)}`); tutorW.push(`tobs.session_id = ${p(sessionId)}`); }
    if (coderId)   { coderW.push(`co.coder_id = ${p(coderId)}`); }
    if (tutorId)   { tutorW.push(`tobs.tutor_id = ${p(tutorId)}`); }

    queries.push(`
      (SELECT 'coder' AS type, co.id, co.coder_id AS target_id,
              u_coder.name AS target_name, u_coder.lastname AS target_lastname,
              co.observed_by,
              u_obs.name AS observer_name, u_obs.lastname AS observer_lastname,
              co.session_id, ms.topic AS session_topic,
              co.observation, co.recommendation, NULL AS technical_notes,
              co.created_at
       FROM coder_observations co
       JOIN users u_coder ON co.coder_id = u_coder.id
       JOIN users u_obs ON co.observed_by = u_obs.id
       LEFT JOIN mentoring_sessions ms ON co.session_id = ms.id
       ${coderW.length ? 'WHERE ' + coderW.join(' AND ') : ''})
    `);
    queries.push(`
      (SELECT 'tutor' AS type, tobs.id, tobs.tutor_id AS target_id,
              u_tutor.name AS target_name, u_tutor.lastname AS target_lastname,
              tobs.observed_by,
              u_obs.name AS observer_name, u_obs.lastname AS observer_lastname,
              tobs.session_id, ms.topic AS session_topic,
              tobs.observation, tobs.recommendation, tobs.technical_notes,
              tobs.created_at
       FROM tutor_observations tobs
       JOIN users u_tutor ON tobs.tutor_id = u_tutor.id
       JOIN users u_obs ON tobs.observed_by = u_obs.id
       LEFT JOIN mentoring_sessions ms ON tobs.session_id = ms.id
       ${tutorW.length ? 'WHERE ' + tutorW.join(' AND ') : ''})
    `);
  }

  const query = queries.join(' UNION ALL ') + ' ORDER BY created_at DESC';
  const { rows } = await pool.query(query, params);
  return rows;
};
