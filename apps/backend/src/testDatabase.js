import pool from "./config/database.js";

try {
  const result = await pool.query("SELECT NOW()");
  console.log(result.rows);
} catch (err) {
  console.error(err);
}
