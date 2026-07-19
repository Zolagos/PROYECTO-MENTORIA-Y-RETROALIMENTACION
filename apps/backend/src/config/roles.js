import pool from "./database.js";

const defaults = {
  TUTOR: "Tutor",
  CODER: "Coder",
  TEAM_LEADER: "Team Leader",
};

let ROLES = {};

export const loadRoles = async () => {
  try {
    const { rows } = await pool.query("SELECT name FROM roles");
    if (rows.length >= 3) {
      for (const row of rows) {
        const key = row.name.toUpperCase().replace(/\s+/g, "_");
        ROLES[key] = row.name;
      }
    }
    if (!ROLES.TUTOR || !ROLES.CODER || !ROLES.TEAM_LEADER) {
      throw new Error("Missing required roles in database");
    }
    console.log("Roles loaded from database");
  } catch {
    console.warn("Roles from DB unavailable, using fallback defaults");
    ROLES = { ...defaults };
  }
  Object.freeze(ROLES);
};

export { ROLES };
