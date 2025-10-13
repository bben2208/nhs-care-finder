// apps/api/src/routes/places.ts
import { Router, Request, Response } from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import { haversineMeters } from "../lib/geo";
import { openingStatus } from "../lib/hours";

type OpeningWindow = { open: string; close: string };
type Opening = {
  mon: OpeningWindow[]; tue: OpeningWindow[]; wed: OpeningWindow[];
  thu: OpeningWindow[]; fri: OpeningWindow[]; sat: OpeningWindow[]; sun: OpeningWindow[];
};

type Place = {
  id: string;
  name: string;
  type: "gp" | "walk-in" | "utc" | "ae";
  distanceMeters?: number;
  status?: { open: boolean; closesInMins?: number };
  location: { lat: number; lon: number };
  address?: string;
  phone?: string;
  website?: string;
  opening?: Opening;
  features?: { xray?: boolean; wheelchair?: boolean; parking?: boolean };
  waitMinutes?: number;
};

// --- Geocoding helpers ---
type LatLon = { lat: number; lon: number };

function normalizePostcode(raw: string): string {
  return raw.replace(/\+/g, " ").replace(/\s+/g, " ").trim().toUpperCase();
}
function extractOutcode(pc: string): string | null {
  const m = normalizePostcode(pc).match(/^([A-Z]{1,2}\d[A-Z\d]?)/);
  return m ? m[1] : null;
}

async function geocodePostcode(raw: string): Promise<LatLon> {
  const cleaned = normalizePostcode(raw);
  const nospace = cleaned.replace(/\s/g, "");

  // 1) Exact full postcode
  try {
    const { data } = await axios.get(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(nospace)}`,
      { timeout: 6000 }
    );
    if (data?.result) return { lat: data.result.latitude, lon: data.result.longitude };
  } catch {}

  // 2) Fuzzy full postcode
  try {
    const { data } = await axios.get(
      "https://api.postcodes.io/postcodes",
      { params: { q: cleaned, limit: 1 }, timeout: 6000 }
    );
    const hit = data?.result?.[0];
    if (hit) return { lat: hit.latitude, lon: hit.longitude };
  } catch {}

  // 3) OUTCODE centroid
  try {
    const out = extractOutcode(cleaned);
    if (out) {
      const { data } = await axios.get(
        `https://api.postcodes.io/outcodes/${encodeURIComponent(out)}`,
        { timeout: 6000 }
      );
      const r = data?.result;
      if (r?.latitude && r?.longitude) return { lat: r.latitude, lon: r.longitude };
    }
  } catch {}

  // 4) OSM fallback
  try {
    const { data } = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: { q: `${cleaned}, UK`, format: "json", limit: 1 },
        headers: { "User-Agent": "nhs-care-finder (learning project)" },
        timeout: 8000
      }
    );
    const hit = Array.isArray(data) ? data[0] : null;
    if (hit?.lat && hit?.lon) return { lat: Number(hit.lat), lon: Number(hit.lon) };
  } catch {}

  throw new Error(`Postcode not found: ${raw}`);
}

const router = Router();

function loadSeed(): Place[] {
  const file = path.join(__dirname, "..", "data", "places.seed.json");
  const raw = fs.readFileSync(file, "utf-8");
  return JSON.parse(raw) as Place[];
}

router.get("/places", async (req: Request, res: Response) => {
  const { type, lat, lon, radius = "10", postcode } = req.query as {
    type?: string; lat?: string; lon?: string; radius?: string; postcode?: string;
  };

  try {
    // Load seed (kept as-is from disk)
    let places = loadSeed();

    // Case-insensitive type filter
    if (type) {
      const t = String(type).toLowerCase();
      places = places.filter((p) => p.type.toLowerCase() === t);
    }

    // Determine origin: postcode OR lat/lon
    let origin: { lat: number; lon: number } | null = null;

    if (postcode) {
      try {
        origin = await geocodePostcode(String(postcode));
      } catch (e) {
        // If postcode can't be geocoded, return 400 with a clear error
        return res.status(400).json({ error: "Invalid postcode" });
      }
    } else if (lat != null && lon != null) {
      const baseLat = Number(lat);
      const baseLon = Number(lon);
      if (Number.isFinite(baseLat) && Number.isFinite(baseLon)) {
        origin = { lat: baseLat, lon: baseLon };
      }
    }

    const radiusKm = Number(radius) || 10;
    const rMeters = radiusKm * 1000;

    // If we have an origin, compute distances + radius filter + sort.
    // Otherwise, return places without distances (unchanged behaviour).
    if (origin) {
      places = places
        .map((p) => {
          const latB = Number((p as any)?.location?.lat);
          const lonB = Number((p as any)?.location?.lon);
          const hasCoords =
            Number.isFinite(latB) && Number.isFinite(lonB) &&
            Number.isFinite(origin!.lat) && Number.isFinite(origin!.lon);

          return {
            ...p,
            distanceMeters: hasCoords ? haversineMeters(origin!, { lat: latB, lon: lonB }) : undefined,
          };
        })
        .filter((p) => (p.distanceMeters ?? Infinity) <= rMeters)
        .sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity));
    } else {
      places = places.map((p) => ({ ...p, distanceMeters: p.distanceMeters }));
    }

    // Opening status
    places = places.map((p) => ({
      ...p,
      status: openingStatus(p.opening),
      distanceMeters: typeof p.distanceMeters === "number" ? p.distanceMeters : undefined,
    }));

    res.json({ results: places });
  } catch (err: any) {
    console.error("[/places] error:", err?.message || err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;