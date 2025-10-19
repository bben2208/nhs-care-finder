type OpeningWindow = { open: string; close: string };
type Opening = {
  mon?: OpeningWindow[]; tue?: OpeningWindow[]; wed?: OpeningWindow[];
  thu?: OpeningWindow[]; fri?: OpeningWindow[]; sat?: OpeningWindow[]; sun?: OpeningWindow[];
};

export function openingStatus(opening?: Opening) {
  try {
    if (!opening) return { open: false as const };
    const idx = new Date().getDay(); // 0 sun .. 6 sat
    const map: (keyof Opening)[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const key = map[idx];
    const slots = (opening[key] ?? []) as OpeningWindow[];
    if (!slots.length) return { open: false as const };
    const now = toMinutes(nowHM());
    for (const s of slots) {
      const start = toMinutes(s.open);
      const end = toMinutes(s.close);
      if (now >= start && now < end) {
        return { open: true as const, closesInMins: end - now };
      }
    }
    return { open: false as const };
  } catch {
    return { open: false as const };
  }
}

function nowHM(): string {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}