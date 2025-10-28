import { useState } from "react";
import { useChatbot } from "./hooks/useChatbot";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Message } from "./components/Message";
import { Button } from "../../shared/ui/Button";

export default function Chatbot() {
  const { log, outcome, ask, reset } = useChatbot();
  const [input, setInput] = useState("");

  return (
    <div style={{
      position: "fixed", right: 16, bottom: 16, width: 340,
      background: "white", border: "1px solid #ddd", borderRadius: 12, padding: 12, zIndex: 50
    }}>
      <Header />
      <div style={{ display: "flex", flexDirection: "column", gap: 4, minHeight: 140 }}>
        {log.map((m, i) => <Message key={i} role={m.role} text={m.text} />)}
      </div>

      {!outcome && (
        <form
          onSubmit={(e) => { e.preventDefault(); if (input.trim()) { ask(input.trim()); setInput(""); } }}
          style={{ display: "flex", gap: 8, marginTop: 8 }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptom…"
            style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
          />
          <Button type="submit">Send</Button>
        </form>
      )}

      <Footer reset={reset} hasOutcome={!!outcome} />
    </div>
  );
}