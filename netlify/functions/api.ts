import express, { NextFunction, Request, Response } from "express";
import serverless from "serverless-http";
import cors from "cors";
import taskRoutes from "../../server/src/routes";
import { initDb } from "../../server/src/db";

const app = express();

app.use(cors());
app.use(express.json());

let tableReady = false;
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  if (!tableReady) {
    try {
      await initDb();
      tableReady = true;
    } catch (err) {
      console.error("Failed to initialize database table:", err);
    }
  }
  next();
});

app.use("/api/tasks", taskRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

export const handler = serverless(app);
