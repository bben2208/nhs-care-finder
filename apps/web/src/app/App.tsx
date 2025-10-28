// apps/web/src/app/App.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// hooks
import { useLocalStorage } from "../shared/hooks/useLocalStorage";
import { useFavourites } from "../features/search/hooks/useFavourites";
import { usePlacesSearch } from "../features/search/hooks/usePlacesSearch";
import { useFiltersAndSort, type Filters, type SortKey } from "../features/search/hooks/useFiltersAndSort";
import { useDirectionsUrl } from "../features/search/hooks/useDirectionsUrl";
import { useThemeTokens } from "../shared/hooks/useThemeTokens";

// UI components (they live in src/components)
import Layout from "../components/Layout";
import SearchForm from "../components/SearchForm";
import Tabs from "../components/Tabs";
import BigMap from "../components/BigMap";
import ResultList from "../components/ResultList";
import GuidancePage from "./routes/GuidancePage";

// Chatbot (feature)
import Chatbot from "../features/chatbot/Chatbot";

export default function App() {
  const [searchParams] = useSearchParams();

  // persisted prefs
  const [postcode, setPostcode] = useLocalStorage<string>("pc", "BN21");
  const [type, setType] = useLocalStorage<string>("type", "");
  const [radius, setRadius] = useLocalStorage<number>("rad", 10);
  const [dark, setDark] = useLocalStorage<boolean>("dark", false);

  const [filters, setFilters] = useState<Filters>({
    open: false, wheelchair: false, parking: false, xray: false, fav: false
  });
  const [tab, setTab] = useState<"list" | "map">("list");
  const [sortBy, setSortBy] = useState<SortKey>("nearest");

  const { isFav, toggleFav } = useFavourites();
  const {
    loading, results, error, expandedId, setExpandedId,
    searchByPostcode, searchByCoords
  } = usePlacesSearch();

  const { toDirections } = useDirectionsUrl();
  const { bg, fg, sub, card, border } = useThemeTokens(dark);

  // seed state from URL on first load
  useEffect(() => {
    const pc = searchParams.get("postcode");
    const ty = searchParams.get("type");
    const radStr = searchParams.get("radius");
    if (pc) setPostcode(pc);
    if (ty !== null) setType(ty);
    if (radStr) {
      const r = Number(radStr);
      if (!Number.isNaN(r) && r > 0) setRadius(r);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchByPostcode(postcode, radius, type || undefined);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => searchByCoords(pos.coords.latitude, pos.coords.longitude, radius, type || undefined),
      () => {}
    );
  };

  const filteredSorted = useFiltersAndSort(results, filters, sortBy, isFav);

  return (
    <Layout dark={dark} toggleDark={() => setDark(d => !d)} fg={fg} border={border} bg={bg}>
      <SearchForm
        postcode={postcode} setPostcode={setPostcode}
        type={type} setType={setType}
        radius={radius} setRadius={setRadius}
        filters={filters} setFilters={setFilters}
        sortBy={sortBy} setSortBy={setSortBy}
        loading={loading}
        onSearch={onSearch}
        useMyLocation={useMyLocation}
        border={border} card={card} fg={fg} sub={sub} dark={dark}
      />

      <Tabs value={tab} onChange={setTab} border={border} card={card} fg={fg} />

      {tab === "list" ? (
        <ResultList
          results={filteredSorted}
          loading={loading}
          error={error || undefined}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
          isFav={isFav}
          toggleFav={toggleFav}
          toDirections={toDirections}
          border={border} card={card} fg={fg} sub={sub} dark={dark}
        />
      ) : (
        <div style={{ marginTop: 16, height: 420, borderRadius: 12, overflow: "hidden", border: `1px solid ${border}` }}>
          <BigMap results={filteredSorted} />
        </div>
      )}

      <p style={{ fontSize: 12, color: sub, marginTop: 20 }}>
        Info only — not medical advice. In emergencies call 999. For advice use NHS 111 online.
      </p>

      <Chatbot border={border} card={card} fg={fg} sub={sub} />
    </Layout>
  );
}