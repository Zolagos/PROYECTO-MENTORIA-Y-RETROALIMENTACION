import pool from '../config/database.js';

export const findAll = async ({ tutorId, coderId } = {}) => {
    let query = `
        SELECT ms.*,
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
    `;
    const params = [];
    const conditions = [];

    if (tutorId) {
        params.push(tutorId);
        conditions.push(`ms.tutor_id = $${params.length}`);
    }

    if (coderId) {
        params.push(coderId);
        conditions.push(`ms.id IN (SELECT session_id FROM session_coders WHERE coder_id = $${params.length})`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY ms.created_at DESC';

    const { rows } = await pool.query(query, params);
    return rows;
};

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

export const assignParticipants = async ({ sessionId, tutorId, coderIds }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        await client.query(
            `UPDATE mentoring_sessions 
            SET tutor_id = $1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $2`,
            [tutorId, sessionId]
        );
        for (const coderId of coderIds) {
            await client.query(
                `INSERT INTO session_coders (session_id, coder_id) VALUES ($1, $2)`, 
                [sessionId, coderId]
            );
        }
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};
