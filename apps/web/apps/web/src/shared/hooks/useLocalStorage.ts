









import { useEffect, useState } from "react";

/**
 * Persist a value in localStorage with a typed React state API.
 * Falls back gracefully if localStorage is unavailable.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const read = (): T => {
    try {
      const raw = window.localStorage?.getItem(key);
      return raw != null ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [value, setValue] = useState<T>(read);

  useEffect(() => {
    try {
      window.localStorage?.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore write errors (private mode, quota, etc.) */
    }
  }, [key, value]);

  return [value, setValue] as const;
}

