export function useDirectionsUrl() {
    const toDirections = (lat: number, lon: number) => {
      const ua = navigator.userAgent || "";
      const isIOSUA = /iPhone|iPad|iPod/i.test(ua);
      const isIPadOS = navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1;
      if (isIOSUA || isIPadOS) return `maps://?daddr=${lat},${lon}&dirflg=d`;
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    };
    return { toDirections };
  }