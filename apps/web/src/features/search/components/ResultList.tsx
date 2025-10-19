import ResultCard from "./ResultCard";
import type { Place } from "../hooks/usePlacesSearch";

type Props = {
  results: Place[];
  loading: boolean;
  error?: string;
  expandedId: string | null;
  setExpandedId: (id: string | null | ((prev: string | null) => string | null)) => void;
  isFav: (id: string) => boolean;
  toggleFav: (id: string) => void;
  toDirections: (lat: number, lon: number) => string;
  border: string; card: string; fg: string; sub: string; dark: boolean;
};

export default function ResultList({
  results, loading, error, expandedId, setExpandedId,
  isFav, toggleFav, toDirections, border, card, fg, sub, dark
}: Props) {
  if (error) {
    return <p role="alert" aria-live="polite" style={{ color: "crimson", marginTop: 8 }}>{error}</p>;
  }

  if (loading && results.length === 0) {
    return (
      <ul style={{ listStyle: "none", padding: 0, marginTop: 16, display: "grid", gap: 8 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} style={{ height: 84, borderRadius: 12, background: card, border: `1px solid ${border}`, opacity: 0.6 }} />
        ))}
      </ul>
    );
  }

  return (
    <ul aria-busy={loading} style={{ listStyle: "none", padding: 0, marginTop: 16, display: "grid", gap: 8 }}>
      {results.map((r) => (
        <ResultCard
          key={r.id}
          place={r}
          expanded={expandedId === r.id}
          onToggle={() => setExpandedId(prev => prev === r.id ? null : r.id)}
          isFav={isFav}
          toggleFav={toggleFav}
          toDirections={toDirections}
          border={border} card={card} fg={fg} sub={sub} dark={dark}
        />
      ))}
    </ul>
  );
}