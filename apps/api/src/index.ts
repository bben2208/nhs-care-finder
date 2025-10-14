import express from "express";
import cors from "cors";
import placesRouter from "./routes/places";

const app = express();

// ✅ Configure allowed origins (Render frontend + local dev)
const allowedOrigins = (process.env.WEB_ORIGIN ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server / curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`[CORS] Blocked origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Ensure preflight requests succeed
app.options("*", cors());

app.use(express.json());

// simple health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// mount main routes
app.use("/", placesRouter);

// 404 handler
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// Start server
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`);
  console.log(`[CORS] Allowed origins:`, allowedOrigins.length ? allowedOrigins : "All (dev mode)");
});