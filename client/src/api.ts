export type TaskStatus = "Complete" | "Incomplete";

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  createdAt: string;
}

type UpdateTaskPayload = Partial<Pick<Task, "name" | "status">>;

const BASE_API_URL = import.meta.env.VITE_API_URL ?? "";

async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_API_URL}/api/tasks${endpoint}`, {
    ...options,
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    throw new Error(errData?.error ?? `Request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export const taskApi = {
  getAll: () => fetchJson<Task[]>(""),
  create: (name: string, status: TaskStatus) =>
    fetchJson<Task>("", { method: "POST", body: JSON.stringify({ name, status }) }),
  update: (id: string, data: UpdateTaskPayload) =>
    fetchJson<Task>(`/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: string) => fetchJson<void>(`/${id}`, { method: "DELETE" }),
};
