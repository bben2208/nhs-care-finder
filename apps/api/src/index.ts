import express from "express";
import cors from "cors";
import placesRouter from "./routes/places";


const app = express();

const ALLOWED_ORIGINS = [
  "https://nhs-care-finder-web.onrender.com", // frontend on Render
  "http://localhost:5173",                     // local dev
];

app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser tools (no origin) and the whitelisted ones
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // if you ever send cookies/auth headers
  })
);

// important: handle preflight for all routes
app.options("*", cors());

// ... your routes, e.g.
app.get("/places", async (req, res) => {
  // ...
});



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