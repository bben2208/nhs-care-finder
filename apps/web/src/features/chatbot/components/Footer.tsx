import { Button } from "../../../shared/ui/Button";

export function Footer({ reset, hasOutcome }: { reset: () => void; hasOutcome: boolean }) {
  return (
    <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
      <Button variant="ghost" onClick={reset}>{hasOutcome ? "Start over" : "Reset"}</Button>
      <a href="https://111.nhs.uk" target="_blank" rel="noreferrer"><Button>Go to NHS 111</Button></a>
    </div>
  );
}