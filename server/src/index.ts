import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { initDb } from "./db";
import taskRoutes from "./routes";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);

const frontendDist = path.join(__dirname, "..", "..", "client", "dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((_req, res) => res.sendFile(path.join(frontendDist, "index.html")));
}

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

async function startServer() {
  try {
    await initDb();
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
