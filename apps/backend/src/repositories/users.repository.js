import pool from '../config/database.js';

export const findByRole = async (roleName, clanId) => {
    const params = [roleName];
    let clanFilter = '';
    if (clanId !== null) {
        params.push(clanId);
        clanFilter = `AND u.clan_id = $${params.length}`;
    }
    const { rows } = await pool.query(
        `SELECT u.id, u.name, u.lastname, u.clan_id
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE r.name = $1 AND u.status = TRUE ${clanFilter}
        ORDER BY u.name`,
        params
    );
    return rows;
};
export const findByIds = async (ids) => {
  const { rows } = await pool.query(
    `SELECT
       u.id,
       u.status,
       u.clan_id,
       r.name AS role
     FROM users u
     JOIN roles r ON r.id = u.role_id
     WHERE u.id = ANY($1::int[])
     ORDER BY u.id`,
    [ids]
  );

  return rows;
};


export const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT
       u.id,
       u.name,
       u.lastname,
       u.email,
       u.status,
       u.clan_id,
       r.name AS role
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.id = $1`,
    [id]
  );

  return rows[0] ?? null;
};

export const findAuthByEmail = async (email) => {
  const { rows } = await pool.query(
    `SELECT u.id, u.name, u.lastname, u.email, u.password_hash, u.status,
            r.name AS role, u.clan_id
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.email = $1`,
    [email]
  );
  return rows[0] ?? null;
};
