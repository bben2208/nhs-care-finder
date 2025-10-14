type Place = {
    id: string;
    name?: string;
    address?: string;
    type: string;
    distanceMeters?: number;
    status: { open: boolean; closesInMins?: number };
    location: { lat: number; lon: number };
    opening?: any;
    waitMinutes?: number | null;
  };
  
  type Props = {
    results: Place[];
    loading: boolean;
    error?: string;
    expandedId: string | null;
    setExpandedId: (id: string | null) => void;
    isFav: (id: string) => boolean;
    toggleFav: (id: string) => void;
    toDirections: (lat: number, lon: number) => string;
    border: string;
    card: string;
    fg: string;
    sub: string;
    dark: boolean;
  };
  
  import ResultCard from "./ResultCard";
  
  const ResultList = ({
    results,
    loading,
    error,
    expandedId,
    setExpandedId,
    isFav,
    toggleFav,
    toDirections,
    border,
    card,
    fg,
    sub,
    dark,
  }: Props) => {
    if (loading) return <p style={{ marginTop: 12 }}>Loading…</p>;
    if (error) return <p style={{ marginTop: 12, color: "#b00" }}>{error}</p>;
    if (!results?.length) return <p style={{ marginTop: 12 }}>No results.</p>;
  
    return (
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12, marginTop: 12 }}>
        {results.map((r) => (
          <ResultCard
            key={r.id}
            place={r}
            expanded={expandedId === r.id}
            onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
            isFav={isFav}
            toggleFav={toggleFav}
            toDirections={toDirections}
            border={border}
            card={card}
            fg={fg}
            sub={sub}
            dark={dark}
          />
        ))}
      </ul>
    );
  };
  
  export default ResultList;