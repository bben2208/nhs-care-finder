import { useLocalStorage } from "../../../shared/hooks/useLocalStorage";
export function useFavourites() {
  const [favs, setFavs] = useLocalStorage<string[]>("favs", []);
  const toggleFav = (id: string) =>
    setFavs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const isFav = (id: string) => favs.includes(id);
  return { favs, isFav, toggleFav };
}