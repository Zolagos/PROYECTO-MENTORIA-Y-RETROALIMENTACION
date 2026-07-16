import pool from '../../../config/database.js';

export const findByrole = async (roleName) => {
    const { rows } = await pool.query(
        `SELECT u.id, u.name, u.lastname, u.clan_id
        FROM users u 
        JOIN roles r ON u.role_id = r.id
        WHERE r.name = $1 AND u.status = TURE
        ORDER BY u.name`,
        [roleName]
    );
    return rows;
};

export const findById = async (ids) => {
    const { rows } = await pool.query(
        `SELECT id, clan_id 
        FROM users 
        WHERE id = ANY($1::int[])`,
        [ids]
    );
    return rows;
};

export const findByUid = async (uid) => {
  const { rows } = await pool.query(
    `SELECT u.id, u.name, u.lastname, u.email, r.name AS role, u.clan_id
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.uid = $1`,
    [uid]
  );
  return rows[0] ?? null;
};