import { Router } from "express";
import * as store from "./store";
import { Task, TaskStatus } from "./types";

const MAX_TITLE_LEN = 200;

const router = Router();

function sanitizeName(rawName: unknown): string | null {
  if (typeof rawName !== "string") return null;
  const trimmed = rawName.trim();
  return trimmed && trimmed.length <= MAX_TITLE_LEN ? trimmed : null;
}

function isValidStatus(val: unknown): val is TaskStatus {
  return val === "Complete" || val === "Incomplete";
}

router.get("/", async (_req, res, next) => {
  try {
    const tasks = await store.getAllTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const cleanName = sanitizeName(req.body?.name);
    const status = req.body?.status ?? "Incomplete";

    if (!cleanName) {
      return res.status(400).json({ error: `Task name is required (max ${MAX_TITLE_LEN} chars).` });
    }
    if (!isValidStatus(status)) {
      return res.status(400).json({ error: "Status must be Complete or Incomplete." });
    }

    const newTask = await store.createTask(cleanName, status);
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { name, status } = req.body ?? {};
    const updates: Partial<Pick<Task, "name" | "status">> = {};

    if (name !== undefined) {
      const cleanName = sanitizeName(name);
      if (!cleanName) {
        return res.status(400).json({ error: "Name cannot be empty or over 200 characters." });
      }
      updates.name = cleanName;
    }
    if (status !== undefined) {
      if (!isValidStatus(status)) return res.status(400).json({ error: "Invalid status." });
      updates.status = status;
    }

    const updatedTask = await store.updateTask(req.params.id, updates);
    if (!updatedTask) return res.status(404).json({ error: "Task not found." });

    res.json(updatedTask);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const removed = await store.deleteTask(req.params.id);
    if (!removed) return res.status(404).json({ error: "Task not found." });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
