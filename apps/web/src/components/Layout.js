import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
export default function Layout({ dark, toggleDark, fg, border, bg, children }) {
    return (_jsxs("div", { style: { maxWidth: 640, margin: "0 auto", padding: 16, fontFamily: "system-ui, sans-serif", background: bg, color: fg, minHeight: "100vh" }, children: [_jsxs("nav", { style: { display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }, children: [_jsx("div", { style: { fontWeight: 700 }, children: "NHS Local Care Finder (demo)" }), _jsxs("div", { style: { marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }, children: [_jsx("button", { onClick: toggleDark, style: { padding: "6px 10px", borderRadius: 8, border: `1px solid ${border}`, background: dark ? "#0f172a" : "#f3f4f6", color: fg }, children: dark ? "☀️ Light" : "🌙 Dark" }), _jsx(Link, { to: "/guidance", style: { textDecoration: "none", color: fg }, children: "Guidance" })] })] }), children] }));
}
