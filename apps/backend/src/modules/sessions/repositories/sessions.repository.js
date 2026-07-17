import pool from '../../../config/database.js';

export const findById = async (id) => {
    const { rows } = await pool.query(
        'SELECT * FROM mentoring_sessions WHERE id = $1',
        [id]
    );
    return rows[0] ?? null;
};

export const assignParticipant = async ({ sessionId, tutorId, coderId }) => {
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
