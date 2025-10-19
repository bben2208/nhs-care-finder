import express from "express";
import cors from "cors";
import placesRouter from "./routes/places";

const app = express();

const allowedOrigins = (process.env.WEB_ORIGIN ?? "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      console.warn(`[CORS] Blocked origin: ${origin}`);
      return cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

app.use(express.json());
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/", placesRouter);
app.use((_req, res) => res.status(404).json({ error: "Not found" }));


const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`);

});