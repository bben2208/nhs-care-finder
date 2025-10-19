import React from "react";
import type { Filters, SortKey } from "../hooks/useFiltersAndSort";

type Props = {
  postcode: string;
  setPostcode: (v: string) => void;
  type: string;
  setType: (v: string) => void;
  radius: number;
  setRadius: (n: number) => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  sortBy: SortKey;
  setSortBy: (k: SortKey) => void;
  loading: boolean;
  onSearch: (e: React.FormEvent) => void;
  useMyLocation: () => void;
  // simple theme tokens from parent
  border: string; card: string; fg: string; sub: string; dark: boolean;
};

export default function SearchForm({
  postcode, setPostcode, type, setType, radius, setRadius,
  filters, setFilters, sortBy, setSortBy,
  loading, onSearch, useMyLocation,
  border, card, fg, sub, dark
}: Props) {
  return (
    <form onSubmit={onSearch} style={{ display: "grid", gap: 8 }}>
      <input
        aria-label="Postcode"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value)}
        placeholder="Enter postcode (e.g., BN21 or SW1A 1AA)"
        style={{ padding: 10, fontSize: 16, borderRadius: 8, border: `1px solid ${border}`, background: card, color: fg }}
      />

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={useMyLocation}
          style={{ padding: 10, fontSize: 14, borderRadius: 8, border: `1px solid ${border}`, background: dark ? "#0f172a" : "#f3f4f6", color: fg }}
        >
          Use my location
        </button>
        <small style={{ alignSelf: "center", color: sub }}>
          (Requires location permission)
        </small>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <select
          aria-label="Service type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 8, border: `1px solid ${border}`, background: card, color: fg }}
        >
          <option value="">All types</option>
          <option value="gp">GP</option>
          <option value="walk-in">Walk-in</option>
          <option value="utc">Urgent Treatment Centre</option>
          <option value="ae">A&amp;E</option>
        </select>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", color: sub }}>
          <label><input type="checkbox" checked={filters.open} onChange={e => setFilters({ ...filters, open: e.target.checked })}/> Open now</label>
          <label><input type="checkbox" checked={filters.wheelchair} onChange={e => setFilters({ ...filters, wheelchair: e.target.checked })}/> Wheelchair</label>
          <label><input type="checkbox" checked={filters.parking} onChange={e => setFilters({ ...filters, parking: e.target.checked })}/> Parking</label>
          <label><input type="checkbox" checked={filters.xray} onChange={e => setFilters({ ...filters, xray: e.target.checked })}/> X-ray</label>
          <label><input type="checkbox" checked={filters.fav} onChange={e => setFilters({ ...filters, fav: e.target.checked })}/> Favourites</label>
        </div>

        {/* Sort */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ color: sub }}>Sort by</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)} style={{ padding: 8, borderRadius: 8, border: `1px solid ${border}`, background: card, color: fg }}>
            <option value="nearest">Nearest</option>
            <option value="open">Open now</option>
            <option value="closing">Soonest closing</option>
            <option value="wait">Shortest wait</option>
          </select>
        </div>
      </div>

      {/* Radius selector (km) */}
      <label style={{ display: "grid", gap: 6, fontSize: 14, color: sub }}>
        <span>Radius: <strong style={{ color: fg }}>{radius}</strong> km</span>
        <input
          type="range"
          min={1}
          max={50}
          step={1}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        style={{ padding: 12, fontSize: 16, borderRadius: 8, border: "none", background: "#0b6", color: "white" }}
      >
        {loading ? "⏳ Searching..." : "Search"}
      </button>
    </form>
  );
}