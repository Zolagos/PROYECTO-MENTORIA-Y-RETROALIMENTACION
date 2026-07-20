import pool from '../config/database.js';

export const findById = async (id) => {
    const { rows } = await pool.query(
        'SELECT * FROM mentoring_sessions WHERE id = $1',
        [id]
    );
    return rows[0] ?? null;
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
