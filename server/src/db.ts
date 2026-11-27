import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/todo_db";

export const dbPool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
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
