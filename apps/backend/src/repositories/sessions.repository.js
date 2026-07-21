import pool from '../config/database.js';
export const findById = async (id) => {
    const { rows } = await pool.query(
        `SELECT ms.*,
                t.name AS tutor_name,
                t.lastname AS tutor_lastname,
                u.name AS creator_name,
                u.lastname AS creator_lastname,
                COALESCE(
                    (SELECT json_agg(json_build_object(
                        'id', c.id,
                        'name', c.name,
                        'lastname', c.lastname,
                        'role', r.name
                    ))
                    FROM session_coders sc
                    JOIN users c ON sc.coder_id = c.id
                    JOIN roles r ON c.role_id = r.id
                    WHERE sc.session_id = ms.id),
                    '[]'::json
                ) AS coders
         FROM mentoring_sessions ms
         LEFT JOIN users t ON ms.tutor_id = t.id
         JOIN users u ON ms.created_by = u.id
         WHERE ms.id = $1`,
        [id]
    );
    return rows[0] ?? null;
};
export const findByClan = async (clanId) => {
  const { rows } = await pool.query(
    `SELECT
       s.*,
       t.name AS tutor_name,
       t.lastname AS tutor_lastname,
       (
         SELECT COUNT(*)::int
         FROM session_coders sc
         WHERE sc.session_id = s.id
       ) AS participant_count
     FROM mentoring_sessions s
     JOIN users t ON t.id = s.tutor_id
     WHERE s.clan_id = $1
     ORDER BY s.start_time ASC, s.id ASC`,
    [clanId]
  );

  return rows;
};
export const findByTutor = async ({ tutorId, clanId }) => {
  const { rows } = await pool.query(
    `SELECT
       s.*,
       t.name AS tutor_name,
       t.lastname AS tutor_lastname,
       (
         SELECT COUNT(*)::int
         FROM session_coders sc
         WHERE sc.session_id = s.id
       ) AS participant_count
     FROM mentoring_sessions s
     JOIN users t ON t.id = s.tutor_id
     WHERE s.tutor_id = $1
       AND s.clan_id = $2
     ORDER BY s.start_time ASC, s.id ASC`,
    [tutorId, clanId]
  );

  return rows;
};
export const findForCoder = async ({ coderId, clanId }) => {
  const { rows } = await pool.query(
    `SELECT
       s.*,
       t.name AS tutor_name,
       t.lastname AS tutor_lastname,
       (
         SELECT COUNT(*)::int
         FROM session_coders sc
         WHERE sc.session_id = s.id
       ) AS participant_count
     FROM mentoring_sessions s
     JOIN users t ON t.id = s.tutor_id
     WHERE s.clan_id = $2
       AND (
         s.session_type = 'open'
         OR EXISTS (
           SELECT 1
           FROM session_coders sc
           WHERE sc.session_id = s.id
             AND sc.coder_id = $1
         )
       )
     ORDER BY s.start_time ASC, s.id ASC`,
    [coderId, clanId]
  );

  return rows;
};
export const findDetailById = async (id) => {
  const { rows } = await pool.query(
    `SELECT
       s.*,
       json_build_object(
         'id', tutor.id,
         'name', tutor.name,
         'lastname', tutor.lastname,
         'email', tutor.email
       ) AS tutor,
       COALESCE(
         json_agg(
           json_build_object(
             'id', coder.id,
             'name', coder.name,
             'lastname', coder.lastname,
             'email', coder.email
           )
           ORDER BY coder.name, coder.lastname
         ) FILTER (WHERE coder.id IS NOT NULL),
         '[]'::json
       ) AS participants
     FROM mentoring_sessions s
     JOIN users tutor ON tutor.id = s.tutor_id
     LEFT JOIN session_coders sc ON sc.session_id = s.id
     LEFT JOIN users coder ON coder.id = sc.coder_id
     WHERE s.id = $1
     GROUP BY
       s.id,
       tutor.id,
       tutor.name,
       tutor.lastname,
       tutor.email`,
    [id]
  );

  return rows[0] ?? null;
};
export const isCoderAssigned = async ({
  sessionId,
  coderId,
}) => {
  const { rowCount } = await pool.query(
    `SELECT 1
     FROM session_coders
     WHERE session_id = $1
       AND coder_id = $2`,
    [sessionId, coderId]
  );

  return rowCount > 0;
};
export const create = async ({
  topic,
  description,
  mentorshipType,
  modality,
  sessionType,
  room,
  meetingLink,
  startTime,
  endTime,
  tutorId,
  clanId,
  createdBy,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO mentoring_sessions (
       topic,
       description,
       mentorship_type,
       modality,
       session_type,
       room,
       meeting_link,
       start_time,
       end_time,
       status,
       tutor_id,
       clan_id,
       created_by
     )
     VALUES (
       $1,
       $2,
       $3,
       $4,
       $5,
       $6,
       $7,
       $8,
       $9,
       'scheduled',
       $10,
       $11,
       $12
     )
     RETURNING *`,
    [
      topic,
      description,
      mentorshipType,
      modality,
      sessionType,
      room,
      meetingLink,
      startTime,
      endTime,
      tutorId,
      clanId,
      createdBy,
    ]
  );

  return rows[0];
};
export const cancelById = async (sessionId) => {
  const { rows } = await pool.query(
    `UPDATE mentoring_sessions
     SET
       status = 'cancelled',
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
       AND status = 'scheduled'
     RETURNING *`,
    [sessionId]
  );

  return rows[0] ?? null;
};
export const updateStatus = async (sessionId, newStatus) => {
  const { rows } = await pool.query(
    `UPDATE mentoring_sessions
     SET
       status = $2,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [sessionId, newStatus]
  );

  return rows[0] ?? null;
};
export const update = async ({
  sessionId,
  topic,
  description,
  mentorshipType,
  modality,
  sessionType,
  room,
  meetingLink,
  startTime,
  endTime,
  tutorId,
}) => {
  const { rows } = await pool.query(
    `UPDATE mentoring_sessions
     SET
       topic = $1,
       description = $2,
       mentorship_type = $3,
       modality = $4,
       session_type = $5,
       room = $6,
       meeting_link = $7,
       start_time = $8,
       end_time = $9,
       tutor_id = $10,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $11
     RETURNING *`,
    [
      topic,
      description,
      mentorshipType,
      modality,
      sessionType,
      room,
      meetingLink,
      startTime,
      endTime,
      tutorId,
      sessionId,
    ]
  );

  return rows[0] ?? null;
};
export const assignParticipants = async ({
  sessionId,
  coderIds,
}) => {
  await pool.query(
    `INSERT INTO session_coders (session_id, coder_id)
     SELECT $1, selected.coder_id
     FROM unnest($2::int[]) AS selected(coder_id)
     ON CONFLICT (session_id, coder_id) DO NOTHING`,
    [sessionId, coderIds]
  );
};
