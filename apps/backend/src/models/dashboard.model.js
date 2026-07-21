import pool from '../config/database.js';

export const getCoderSummary = async (coderId) => {
  const { rows } = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM session_coders sc
          JOIN mentoring_sessions ms ON ms.id = sc.session_id
          WHERE sc.coder_id = $1
            AND date_trunc('month', ms.start_time) = date_trunc('month', CURRENT_DATE)) AS sessions_this_month,
       (SELECT COUNT(*) FROM session_coders sc
          JOIN mentoring_sessions ms ON ms.id = sc.session_id
          WHERE sc.coder_id = $1 AND ms.status = 'completed') AS completed,
       (SELECT COUNT(*) FROM mentoring_requests WHERE coder_id = $1 AND state = 'pending') AS pending`,
    [coderId]
  );
  return rows[0];
};

export const getTutorSummary = async (tutorId) => {
  const { rows } = await pool.query(
    `SELECT
       (SELECT COUNT(DISTINCT sc.coder_id) FROM session_coders sc
          JOIN mentoring_sessions ms ON ms.id = sc.session_id
          WHERE ms.tutor_id = $1) AS assigned_coders,
       (SELECT COUNT(*) FROM mentoring_sessions
          WHERE tutor_id = $1 AND status IN ('scheduled', 'in_progress')) AS active_mentorships,
       (SELECT COUNT(*) FROM session_coders sc
          JOIN mentoring_sessions ms ON ms.id = sc.session_id
          WHERE ms.tutor_id = $1
            AND ms.status = 'completed'
            AND NOT EXISTS (
              SELECT 1 FROM session_feedback sf
              WHERE sf.session_id = sc.session_id AND sf.coder_id = sc.coder_id
            )) AS pending_feedbacks`,
    [tutorId]
  );
  return rows[0];
};

export const getTeamLeaderSummary = async (clanId) => {
  const { rows } = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM users WHERE clan_id = $1) AS total_users,
       (SELECT COUNT(*) FROM mentoring_sessions WHERE clan_id = $1 AND status = 'completed') AS completed_mentorships,
       (SELECT COUNT(*) FROM mentoring_requests mr
          JOIN users u ON u.id = mr.coder_id
          WHERE u.clan_id = $1 AND mr.state = 'pending') AS pending_mentorships,
       (SELECT COUNT(*) FROM mentoring_sessions WHERE clan_id = $1) AS total_sessions`,
    [clanId]
  );
  return rows[0];
};

export const getMetrics = async (clanId) => {
  const [totals, rating, byStatus, byModality] = await Promise.all([
    pool.query(
      `SELECT
         (SELECT COUNT(*) FROM mentoring_sessions WHERE clan_id = $1) AS total_mentorships,
         (SELECT COUNT(*) FROM mentoring_sessions WHERE clan_id = $1 AND status = 'completed') AS completed_mentorships,
         (SELECT COUNT(*) FROM users WHERE clan_id = $1 AND role_id = (SELECT id FROM roles WHERE name = 'Coder') AND status = TRUE) AS active_coders`,
      [clanId]
    ),
    pool.query(
      `SELECT AVG((sf.tutor_rating + sf.session_rating) / 2.0) AS average_rating
       FROM session_feedback sf
       JOIN mentoring_sessions ms ON ms.id = sf.session_id
       WHERE ms.clan_id = $1`,
      [clanId]
    ),
    pool.query(
      `SELECT status, COUNT(*)::int AS count
       FROM mentoring_sessions
       WHERE clan_id = $1
       GROUP BY status`,
      [clanId]
    ),
    pool.query(
      `SELECT modality, COUNT(*)::int AS count
       FROM mentoring_sessions
       WHERE clan_id = $1
       GROUP BY modality`,
      [clanId]
    ),
  ]);

  return {
    totalMentorships: Number(totals.rows[0].total_mentorships),
    completedMentorships: Number(totals.rows[0].completed_mentorships),
    activeCoders: Number(totals.rows[0].active_coders),
    averageRating: rating.rows[0].average_rating ? Number(rating.rows[0].average_rating) : 0,
    byStatus: byStatus.rows,
    byModality: byModality.rows,
  };
};
