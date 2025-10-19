import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();
app.use(helmet());
app.use(express.json());
// --- DEBUG CORS: log origin and allow cross-origin for all requests (including preflight) ---
app.use((req, _res, next) => {
  console.log("[REQ]", req.method, req.path, "Origin:", req.headers.origin || "(none)");
  next();
});
app.use(cors({
  origin: true,            // reflect the request origin
  credentials: false,      // we don't use cookies
  methods: ["GET", "HEAD", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept"],
  maxAge: 86400
}));
// Handle preflight explicitly (some proxies drop automatic handling)
app.options("*", cors({
  origin: true,
  credentials: false,
  methods: ["GET", "HEAD", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept"],
  maxAge: 86400
}));

app.get("/", (_req: Request, res: Response) =>
  res.json({ ok: true, name: "nhs-care-finder-api" })
);
app.use("/places", placesRouter);
app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error", details: err.details });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));