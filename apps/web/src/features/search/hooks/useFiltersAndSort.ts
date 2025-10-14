import { useMemo } from "react";
import type { Place } from "./usePlacesSearch";

export type SortKey = "nearest" | "open" | "closing" | "wait";
export type Filters = {
  open: boolean;
  wheelchair: boolean;
  parking: boolean;
  xray: boolean;
  fav: boolean;
};

export function useFiltersAndSort(
  results: Place[],
  filters: Filters,
  sortBy: SortKey,
  isFav: (id: string) => boolean
) {
  return useMemo(() => {
    let arr = results.slice();
    if (filters.open) arr = arr.filter(r => r.status.open);
    if (filters.wheelchair) arr = arr.filter(r => r.features?.wheelchair);
    if (filters.parking) arr = arr.filter(r => r.features?.parking);
    if (filters.xray) arr = arr.filter(r => r.features?.xray);
    if (filters.fav) arr = arr.filter(r => isFav(r.id));

    arr.sort((a, b) => {
      switch (sortBy) {
        case "open":
          if (a.status.open !== b.status.open) return a.status.open ? -1 : 1;
          return a.distanceMeters - b.distanceMeters;
        case "closing":
          return (a.status.closesInMins ?? Infinity) - (b.status.closesInMins ?? Infinity);
        case "wait":
          return (a.waitMinutes ?? Infinity) - (b.waitMinutes ?? Infinity);
        default:
          return a.distanceMeters - b.distanceMeters;
      }
    });
    return arr;
  }, [results, filters.open, filters.wheelchair, filters.parking, filters.xray, filters.fav, sortBy, isFav]);
}