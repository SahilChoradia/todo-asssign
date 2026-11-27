import { useEffect, useState } from "react";
import { Task, taskApi } from "../api";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    taskApi
      .getAll()
      .then(setTasks)
      .catch((err: Error) => setErrorMsg(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  async function runRequest(fn: () => Promise<void>): Promise<boolean> {
    setErrorMsg(null);
    try {
      await fn();
      return true;
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      return false;
    }
  }

  function updateTask(id: string, changes: Partial<Pick<Task, "name" | "status">>) {
    return runRequest(async () => {
      const savedTask = await taskApi.update(id, changes);
      setTasks((prevTasks) => prevTasks.map((item) => (item.id === id ? savedTask : item)));
    });
  }

  function deleteTask(id: string) {
    return runRequest(async () => {
      await taskApi.remove(id);
      setTasks((prevTasks) => prevTasks.filter((item) => item.id !== id));
    });
  }

  return { tasks, isLoading, errorMsg, updateTask, deleteTask };
}
