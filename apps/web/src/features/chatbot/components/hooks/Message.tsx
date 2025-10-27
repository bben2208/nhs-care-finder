export function Message({ role, text }: { role: "assistant" | "user"; text: string }) {
    const isUser = role === "user";
    return (
      <div style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        background: isUser ? "#e6f7ff" : "#f1f5f9",
        padding: "8px 12px", borderRadius: 12, margin: "4px 0", maxWidth: 320
      }}>
        {text}
      </div>
    );
  }