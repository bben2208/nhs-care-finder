type Props = {
    value: "list" | "map";
    onChange: (v: "list" | "map") => void;
    border: string;
    card: string;
    fg: string;
  };
  
  const Tabs = ({ value, onChange, border, card, fg }: Props) => {
    const base = {
      padding: "8px 12px",
      borderRadius: 8,
      border: `1px solid ${border}`,
      cursor: "pointer",
    } as const;
  
    return (
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={() => onChange("list")}
          style={{
            ...base,
            background: value === "list" ? "#0b6" : card,
            color: value === "list" ? "white" : fg,
          }}
        >
          List
        </button>
        <button
          onClick={() => onChange("map")}
          style={{
            ...base,
            background: value === "map" ? "#0b6" : card,
            color: value === "map" ? "white" : fg,
          }}
        >
          Map
        </button>
      </div>
    );
  };
  
  export default Tabs;