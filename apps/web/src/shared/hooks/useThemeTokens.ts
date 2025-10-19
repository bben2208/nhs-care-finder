// apps/web/src/shared/hooks/useThemeTokens.ts
export function useThemeTokens(dark: boolean) {
    // minimal token set used across the app
    const bg     = dark ? "#0b1220" : "#ffffff";
    const fg     = dark ? "#e5e7eb" : "#111827";
    const sub    = dark ? "rgba(229,231,235,.7)" : "#6b7280";
    const card   = dark ? "#111827" : "#f9fafb";
    const border = dark ? "rgba(255,255,255,.12)" : "#e5e7eb";
  
    return { bg, fg, sub, card, border };
  }