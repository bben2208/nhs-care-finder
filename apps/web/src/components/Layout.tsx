import React from "react";

type Props = {
  dark: boolean;
  toggleDark: () => void;
  fg: string;
  border: string;
  bg: string;
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ dark, toggleDark, fg, border, bg, children }) => {
  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: 16,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        background: bg,
        color: fg,
        minHeight: "100vh",
      }}
    >
      <nav
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 12,
          borderBottom: `1px solid ${border}`,
          paddingBottom: 8,
        }}
      >
        <div style={{ fontWeight: 700 }}>NHS Local Care Finder (demo)</div>
        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={toggleDark}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: "transparent",
              color: fg,
              cursor: "pointer",
            }}
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </nav>

      {children}
    </div>
  );
};

export default Layout;