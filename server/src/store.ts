import { dbPool } from "./db";
import { Task, TaskStatus } from "./types";

interface TaskRow {
  id: string;
  name: string;
  status: string;
  created_at: Date;
}

function mapRow(row: TaskRow): Task {
  return {
    id: row.id,
    name: row.name,
    status: row.status as TaskStatus,
    createdAt: row.created_at.toISOString(),
  };
}

export async function getAllTasks(): Promise<Task[]> {
  const { rows } = await dbPool.query<TaskRow>(
    "SELECT id, name, status, created_at FROM tasks ORDER BY created_at DESC"
  );
  return rows.map(mapRow);
}

export async function createTask(name: string, status: TaskStatus): Promise<Task> {
  const { rows } = await dbPool.query<TaskRow>(
    "INSERT INTO tasks (name, status) VALUES ($1, $2) RETURNING id, name, status, created_at",
    [name, status]
  );
  return mapRow(rows[0]);
}

export async function updateTask(
  id: string,
  updates: Partial<Pick<Task, "name" | "status">>
): Promise<Task | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIdx = 1;

  if (updates.name !== undefined) {
    fields.push(`name = $${paramIdx++}`);
    values.push(updates.name);
  }
  if (updates.status !== undefined) {
    fields.push(`status = $${paramIdx++}`);
    values.push(updates.status);
  }

  if (fields.length === 0) {
    const { rows } = await dbPool.query<TaskRow>(
      "SELECT id, name, status, created_at FROM tasks WHERE id = $1",
      [id]
    );
    return rows.length ? mapRow(rows[0]) : null;
  }

  values.push(id);
  const sql = `UPDATE tasks SET ${fields.join(", ")} WHERE id = $${paramIdx} RETURNING id, name, status, created_at`;
  const { rows } = await dbPool.query<TaskRow>(sql, values);
  return rows.length ? mapRow(rows[0]) : null;
}

export async function deleteTask(id: string): Promise<boolean> {
  const result = await dbPool.query("DELETE FROM tasks WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}
