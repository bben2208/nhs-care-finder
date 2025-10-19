// apps/web/src/components/Chatbot.tsx
import { useTriage } from "./hooks/useTriage";
import { useState } from "react";

type Props = {
  border: string;
  card: string;
  fg: string;
  sub: string;
  accent?: string; // optional brand color
};

export default function Chatbot({ border, card, fg, sub, accent = "#0b6" }: Props) {
  const [open, setOpen] = useState(false);
  const { step, stepIndex, steps, outcome, go, reset } = useTriage();

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          position: "fixed", right: 16, bottom: 16, zIndex: 50,
          padding: "12px 14px", borderRadius: 999, background: accent, color: "white",
          border: "none", boxShadow: "0 6px 18px rgba(0,0,0,.2)", cursor: "pointer"
        }}
      >
        {open ? "Close triage" : "Triage helper"}
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Triage helper"
          style={{
            position: "fixed", right: 16, bottom: 74, width: 360, maxWidth: "90vw",
            background: card, color: fg, border: `1px solid ${border}`, borderRadius: 12,
            boxShadow: "0 10px 24px rgba(0,0,0,.25)", overflow: "hidden", zIndex: 49
          }}
        >
          <Header sub={sub} />

          <div style={{ padding: 12, maxHeight: 420, overflowY: "auto" }}>
            {!outcome ? (
              <Question
                idx={stepIndex + 1}
                total={steps.length}
                text={step.text}
                type={step.type}
                options={step.options}
                onAnswer={(val) => go(step, val)}
                sub={sub}
                accent={accent}
              />
            ) : (
              <OutcomeView outcome={outcome} accent={accent} sub={sub} />
            )}
          </div>

          <Footer reset={reset} hasOutcome={!!outcome} />
        </div>
      )}
    </>
  );
}

function Header({ sub }: { sub: string }) {
  return (
    <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
      <div style={{ fontWeight: 700 }}>Information only, not medical advice</div>
      <div style={{ fontSize: 12, color: sub }}>If you are very worried at any time, call 999.</div>
    </div>
  );
}
function Footer({ reset, hasOutcome }: { reset: () => void; hasOutcome: boolean }) {  return (
    <div style={{ padding: "8px 12px", borderTop: "1px solid rgba(0,0,0,.06)", display: "flex", gap: 8, justifyContent: "space-between" }}>
      <a href="https://111.nhs.uk/" target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>NHS 111 online</a>
      <div style={{ display: "flex", gap: 8 }}>
        {hasOutcome && (
          <button onClick={reset} style={{ fontSize: 13, padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", background: "#f6f7f9" }}>
            Restart
          </button>
        )}
      </div>
    </div>
  );
}

function Question({
  idx, total, text, type, options, onAnswer, sub, accent
}: {
  idx: number; total: number; text: string; type: "yesno" | "single" | "number";
  options?: { value: string; label: string }[];
  onAnswer: (val: any) => void; sub: string; accent: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 12, color: sub, marginBottom: 6 }}>Question {idx} of {total}</div>
      <div style={{ marginBottom: 10 }}>{text}</div>

      {type === "yesno" && (
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onAnswer(true)}  style={btn(accent)}>Yes</button>
          <button onClick={() => onAnswer(false)} style={btnAlt()}>No</button>
        </div>
      )}

      {type === "single" && (
        <div style={{ display: "grid", gap: 8 }}>
          {options?.map(o => (
            <button key={o.value} onClick={() => onAnswer(o.value)} style={btn(accent)}>{o.label}</button>
          ))}
        </div>
      )}

      {type === "number" && (
        <NumberPrompt onSubmit={(n) => onAnswer(n)} />
      )}
    </div>
  );
}

function NumberPrompt({ onSubmit }: { onSubmit: (n: number) => void }) {
  const [val, setVal] = useState<string>("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); const n = Number(val); if (!Number.isNaN(n)) onSubmit(n); }}>
      <input
        type="number"
        inputMode="numeric"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Enter a number"
        style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", marginBottom: 8 }}
      />
      <button type="submit" style={btn("#0b6")}>Continue</button>
    </form>
  );
}

function OutcomeView({ outcome, accent, sub }: { outcome: "CALL_999" | "A_AND_E" | "UTC_GP" | "SELF_CARE"; accent: string; sub: string }) {
  const title = {
    CALL_999: "Call 999 now",
    A_AND_E: "Go to A&E now",
    UTC_GP: "Urgent treatment / same-day GP",
    SELF_CARE: "Self-care or NHS 111"
  }[outcome];

  const detail = {
    CALL_999: "Apply firm direct pressure to severe bleeding. Stay with the person while you call 999.",
    A_AND_E: "Attend the nearest A&E as soon as possible. Take any medications/allergies list.",
    UTC_GP: "You may need urgent but non-emergency care. A UTC or same-day GP is suitable.",
    SELF_CARE: "Consider NHS 111 online for tailored advice, and monitor symptoms. Seek help if symptoms worsen."
  }[outcome];

  // Helpful quick links
  const links = [
    { href: "tel:999", label: "Call 999" },
    { href: "/?type=ae", label: "Find A&E nearby" },
    { href: "/?type=utc", label: "Find UTC nearby" },
    { href: "https://111.nhs.uk/", label: "NHS 111 online", external: true },
  ];

  const show = {
    CALL_999: [links[0], links[1]],
    A_AND_E: [links[1], links[3]],
    UTC_GP: [links[2], links[3]],
    SELF_CARE: [links[3]],
  }[outcome];

  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
      <div style={{ color: sub, marginBottom: 12 }}>{detail}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {show.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.external ? "_blank" : undefined}
            rel={l.external ? "noreferrer" : undefined}
            style={btn(accent)}
          >
            {l.label}
          </a>
        ))}
      </div>
      <p style={{ fontSize: 12, color: sub, marginTop: 12 }}>
        If symptoms worsen, seek urgent help.
      </p>
    </div>
  );
}

// button styles
function btn(bg: string): React.CSSProperties {
  return {
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    background: bg,
    color: "white",
    cursor: "pointer"
  };
}
function btnAlt(): React.CSSProperties {
  return {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#f6f7f9",
    color: "#111",
    cursor: "pointer"
  };
}