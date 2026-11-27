export type TaskStatus = "Complete" | "Incomplete";

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  createdAt: string;
}
