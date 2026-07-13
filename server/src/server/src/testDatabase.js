import pool from "./config/database.js";

try {
  const result = await pool.query("SELECT NOW();");

  console.log("✅ PostgreSQL conectado");
  console.log(result.rows);
} catch (error) {
  console.error("❌ Error de conexión");
  console.error(error);
} finally {
  await pool.end();
}
