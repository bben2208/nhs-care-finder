import express from "express";
import cors from "cors";
import placesRouter from "./routes/places";

const app = express();
app.use(cors({ origin: process.env.WEB_ORIGIN || true }));
app.use(express.json());

// simple health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// IMPORTANT: mount routes at root so GET /places works
app.use("/", placesRouter);

// 404
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// src/index.ts
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`));