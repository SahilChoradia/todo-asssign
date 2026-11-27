import express, { NextFunction, Request, Response } from "express";
import serverless from "serverless-http";
import cors from "cors";
import taskRoutes from "../../server/src/routes";
import { initDb } from "../../server/src/db";

const app = express();

app.use(cors());
app.use(express.json());

let tableReady = false;
let initError: Error | null = null;

app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  if (!tableReady) {
    try {
      await initDb();
      tableReady = true;
      initError = null;
    } catch (err) {
      initError = err instanceof Error ? err : new Error(String(err));
      console.error("Database connection / init failed:", initError);
    }
  }
  next();
});

app.use("/api/tasks", (req: Request, res: Response, next: NextFunction) => {
  if (!tableReady && initError) {
    return res.status(500).json({
      error: `Database connection error: ${initError.message}`,
    });
  }
  next();
});

app.use("/api/tasks", taskRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  const message = err instanceof Error ? err.message : "Internal server error.";
  res.status(500).json({ error: message });
});

export const handler = serverless(app);
