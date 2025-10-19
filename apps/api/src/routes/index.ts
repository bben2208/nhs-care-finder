import { Router } from "express";
import placesRouter from "./places";

const router = Router();

router.get("/health", (_req, res) => res.json({ ok: true }));
router.use("/places", placesRouter);

export default router;