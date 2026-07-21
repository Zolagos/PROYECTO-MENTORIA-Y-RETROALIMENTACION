import pool from './database.js';

export const ROLES = Object.freeze({
  TUTOR: 'Tutor',
  CODER: 'Coder',
  TEAM_LEADER: 'Team Leader',
});

export const loadRoles = async () => {
  try {
    const { rows } = await pool.query(
      'SELECT name::text AS name FROM roles'
    );

    const databaseRoles = new Set(rows.map((row) => row.name));

    const missingRoles = Object.values(ROLES).filter(
      (role) => !databaseRoles.has(role)
    );

    if (missingRoles.length > 0) {
      throw new Error(
        `Missing required roles: ${missingRoles.join(', ')}`
      );
    }

    console.log('Roles verified in database');
  } catch (error) {
    console.warn(
      `Roles from DB unavailable, using fallback defaults: ${error.message}`
    );
  }
};
