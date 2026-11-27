import { Pool } from "pg";

const rawConnectionString =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/todo_db";

// Remove ?sslmode=... from connection string so pg doesn't override the ssl object
const cleanConnectionString = rawConnectionString
  .replace(/[?&]sslmode=[^&]+/g, "")
  .replace(/\?$/, "");

const isRemoteDb =
  rawConnectionString.includes("supabase.co") ||
  rawConnectionString.includes("pooler.supabase.com") ||
  rawConnectionString.includes("sslmode=") ||
  process.env.NODE_ENV === "production";

export const dbPool = new Pool({
  connectionString: cleanConnectionString,
  ssl: isRemoteDb
    ? {
        rejectUnauthorized: false,
      }
    : false,
});

export async function initDb(): Promise<void> {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(200) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'Incomplete',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await dbPool.query(createTableQuery);
}
