type Filters = {
    open: boolean;
    wheelchair: boolean;
    parking: boolean;
    xray: boolean;
    fav: boolean;
  };
  
  type Props = {
    postcode: string;
    setPostcode: (v: string) => void;
    type: string;
    setType: (v: string) => void;
    radius: number;
    setRadius: (v: number) => void;
    filters: Filters;
    setFilters: (v: Filters) => void;
    sortBy: string;
    setSortBy: (v: any) => void;
    loading: boolean;
    onSearch: (e: React.FormEvent) => void;
    useMyLocation: () => void;
    border: string;
    card: string;
    fg: string;
    sub: string;
    dark: boolean;
  };
  
  const SearchForm = ({
    postcode,
    setPostcode,
    type,
    setType,
    radius,
    setRadius,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    loading,
    onSearch,
    useMyLocation,
    border,
    card,
    fg,
    sub,
  }: Props) => {
    return (
      <form onSubmit={onSearch} style={{ display: "grid", gap: 8, marginTop: 8 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Postcode"
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: card,
              color: fg,
            }}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: card,
              color: fg,
            }}
          >
            <option value="">Any</option>
            <option value="gp">GP</option>
            <option value="walk-in">Walk-in</option>
            <option value="utc">Urgent Treatment Centre</option>
            <option value="ae">A&amp;E</option>
          </select>
          <button
            type="button"
            onClick={useMyLocation}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: card,
              color: fg,
              cursor: "pointer",
            }}
          >
            Use my location
          </button>
        </div>
  
        <label style={{ fontSize: 12, color: sub }}>
          Radius: {radius} km
          <input
            type="range"
            min={1}
            max={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>
  
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: card,
              color: fg,
            }}
          >
            <option value="nearest">Nearest</option>
            <option value="open">Open now</option>
            <option value="wait">Shortest wait</option>
          </select>
  
          {[
            ["open", "Open now"],
            ["wheelchair", "Wheelchair access"],
            ["parking", "Parking"],
            ["xray", "X-ray"],
            ["fav", "Favourites"],
          ].map(([key, label]) => (
            <label key={key} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={(filters as any)[key]}
                onChange={(e) => setFilters({ ...filters, [key]: e.target.checked } as any)}
              />
              <span style={{ fontSize: 13, color: fg }}>{label}</span>
            </label>
          ))}
        </div>
  
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: `1px solid ${border}`,
            background: loading ? "#0b6aa0" : "#0b6",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>
    );
  };
  
  export default SearchForm;