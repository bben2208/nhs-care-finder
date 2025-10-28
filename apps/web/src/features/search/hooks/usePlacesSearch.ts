import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiGetWithFallback } from "../../../shared/lib/api";

export type OpeningWindow = { open: string; close: string };
export type Opening = {
  mon: OpeningWindow[]; tue: OpeningWindow[]; wed: OpeningWindow[];
  thu: OpeningWindow[]; fri: OpeningWindow[]; sat: OpeningWindow[]; sun: OpeningWindow[];
};

export type Place = {
  id: string;
  name: string;
  type: "gp" | "walk-in" | "utc" | "ae";
  distanceMeters: number;
  status: { open: boolean; closesInMins?: number };
  location: { lat: number; lon: number };
  address?: string;
  phone?: string;
  website?: string;
  opening: Opening;
  features?: { xray?: boolean; wheelchair?: boolean; parking?: boolean };
  waitMinutes?: number;
};

const MAX_RESULTS = 3;

function normalizeResults(payload: any): Place[] {
  if (Array.isArray(payload)) return payload as Place[];
  if (payload && Array.isArray(payload.results)) return payload.results as Place[];
  return [];
}

export function usePlacesSearch() {
  const [, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Place[]>([]);
  const [error, setError] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const searchByPostcode = useCallback(
    async (postcode: string, radiusKm: number, type?: string) => {
      console.log(
        "%c[usePlacesSearch] 🔍 Starting postcode search...",
        "color: #1e90ff; font-weight: bold",
        { postcode, radiusKm, type }
      );

      setLoading(true);
      setError("");
      setResults([]);
      setExpandedId(null);

      try {
        const qs = new URLSearchParams();
        qs.set("postcode", postcode);
        qs.set("radius", String(radiusKm));
        if (type) qs.set("type", type);

        console.log(
          "%c[usePlacesSearch] 🌐 Query string:",
          "color: #00bfff; font-weight: bold",
          qs.toString()
        );

        const { data, source } = await apiGetWithFallback<any>("/places", qs.toString());

        console.log(
          "%c[usePlacesSearch] ✅ API call finished:",
          "color: #32cd32; font-weight: bold",
          "Source:", source,
          "Data:", data
        );

        const listAll = normalizeResults(data);
        const list = listAll.slice(0, MAX_RESULTS); // ⬅️ cap to 3
        setResults(list);
        setExpandedId(list[0]?.id ?? null);

        console.log(
          "%c[usePlacesSearch] 📋 Normalized results:",
          "color: #7fff00; font-weight: bold",
          { returned: listAll.length, showing: list.length, ids: list.map(x => x.id) }
        );

        const next: Record<string, string> = { postcode, radius: String(radiusKm) };
        if (type) next.type = type;
        setSearchParams(next, { replace: false });
      } catch (e: any) {
        console.error(
          "%c[usePlacesSearch] ❌ Error during postcode search:",
          "color: red; font-weight: bold",
          e
        );
        setError(e?.message || "Search failed");
      } finally {
        setLoading(false);
        console.log("%c[usePlacesSearch] 🔁 Done.", "color: gray;");
      }
    },
    [setSearchParams]
  );

  const searchByCoords = useCallback(
    async (lat: number, lon: number, radiusKm: number, type?: string) => {
      console.log(
        "%c[usePlacesSearch] 📍 Starting coordinate search...",
        "color: #ff7f50; font-weight: bold",
        { lat, lon, radiusKm, type }
      );

      setLoading(true);
      setError("");
      setResults([]);
      setExpandedId(null);

      try {
        const qs = new URLSearchParams();
        qs.set("lat", String(lat));
        qs.set("lon", String(lon));
        qs.set("radius", String(radiusKm));
        if (type) qs.set("type", type);

        console.log(
          "%c[usePlacesSearch] 🌐 Query string:",
          "color: #00bfff; font-weight: bold",
          qs.toString()
        );

        const { data, source } = await apiGetWithFallback<any>("/places", qs.toString());

        console.log(
          "%c[usePlacesSearch] ✅ API call finished:",
          "color: #32cd32; font-weight: bold",
          "Source:", source,
          "Data:", data
        );

        const listAll = normalizeResults(data);
        const list = listAll.slice(0, MAX_RESULTS); // ⬅️ cap to 3
        setResults(list);
        setExpandedId(list[0]?.id ?? null);

        console.log(
          "%c[usePlacesSearch] 📋 Normalized results:",
          "color: #7fff00; font-weight: bold",
          { returned: listAll.length, showing: list.length, ids: list.map(x => x.id) }
        );

        const next: Record<string, string> = {
          lat: String(lat),
          lon: String(lon),
          radius: String(radiusKm),
        };
        if (type) next.type = type;
        setSearchParams(next, { replace: false });
      } catch (e: any) {
        console.error(
          "%c[usePlacesSearch] ❌ Error during coordinate search:",
          "color: red; font-weight: bold",
          e
        );
        setError(e?.message || "Search failed");
      } finally {
        setLoading(false);
        console.log("%c[usePlacesSearch] 🔁 Done.", "color: gray;");
      }
    },
    [setSearchParams]
  );

  return {
    loading,
    results,
    error,
    expandedId,
    setExpandedId,
    searchByPostcode,
    searchByCoords,
  };
}