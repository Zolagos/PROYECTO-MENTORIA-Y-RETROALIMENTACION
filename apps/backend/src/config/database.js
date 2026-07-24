import { Pool } from "pg";
import env from "./env.js";

// Railway's Postgres plugin exposes a single DATABASE_URL; local/dev setups
// use the discrete DB_* vars instead. Railway's Postgres doesn't have SSL
// enabled by default, so leave ssl unset — pg respects a `?sslmode=` query
// param on the connection string if one is ever needed.
const pool = env.DATABASE_URL
  ? new Pool({ connectionString: env.DATABASE_URL })
  : new Pool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      database: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
    });

export default pool;
