// apps/web/src/shared/lib/api.ts
const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export async function apiGetWithFallback<T = any>(
  path: string,
  queryString?: string
): Promise<{ data: T; source: "api" | "fallback" }> {
  const qs = queryString ? `?${queryString}` : "";
  const primary = `${API_BASE}${path}${qs}`;

  // 🟦 DEBUG LOGS
  console.log(
    "%c[API INIT]",
    "color: #00bfff; font-weight: bold",
    "\nBase:", API_BASE || "(empty!)",
    "\nPath:", path,
    "\nFull URL:", primary
  );

  try {
    const res = await fetch(primary, { headers: { Accept: "application/json" } });

    // 🟧 Log response status before throwing
    console.log(
      "%c[API RESPONSE]",
      "color: #ffa500; font-weight: bold",
      res.status,
      res.statusText
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = (await res.json()) as T;

    console.log(
      "%c[API SUCCESS]",
      "color: #00ff7f; font-weight: bold",
      "Data received:", data
    );

    return { data, source: "api" };
  } catch (err) {
    console.warn(
      "%c[API FALLBACK]",
      "color: #ff4444; font-weight: bold",
      "Falling back to /places.json due to:",
      err
    );

    try {
      const res2 = await fetch(`/places.json`, {
        headers: { Accept: "application/json" },
      });
      if (!res2.ok) throw new Error(`HTTP ${res2.status}`);

      const fallbackList = (await res2.json()) as any[];
      const data = { results: fallbackList } as unknown as T;

      console.log(
        "%c[FALLBACK SUCCESS]",
        "color: #ff69b4; font-weight: bold",
        "Loaded demo data:", fallbackList
      );

      return { data, source: "fallback" };
    } catch (err2) {
      console.error(
        "%c[FALLBACK ERROR]",
        "color: red; font-weight: bold",
        err2
      );
      throw err2;
    }
  }
}