import { useCallback, useState } from "react";
import type { Message, Outcome, StepId } from "../types";

export function useChatbot() {
  const [log, setLog] = useState<Message[]>([
    { role: "assistant", text: "Hi — I can offer general guidance (not medical advice). What’s wrong?" }
  ]);
  const [step, setStep] = useState<StepId>("entry");
  const [outcome, setOutcome] = useState<Outcome>(null);

  const ask = useCallback((text: string) => {
    setLog(l => [...l, { role: "user", text }]);
    const t = text.toLowerCase();

    if (t.includes("bleed") && (t.includes("heavy") || t.includes("won’t stop") || t.includes("won't stop"))) {
      setOutcome({ severity: "emergency", action: "call_999", reason: "Severe bleeding" });
      setLog(l => [...l, { role: "assistant", text: "This sounds serious — call 999 now." }]);
      setStep("outcome");
      return;
    }
    if (t.includes("ankle") || t.includes("sprain")) {
      setOutcome({ severity: "urgent", action: "utc_or_ae", reason: "Possible injury" });
      setLog(l => [...l, { role: "assistant", text: "You may need an X-ray. Go to UTC/A&E if you can’t bear weight or pain is severe." }]);
      setStep("outcome");
      return;
    }

    setLog(l => [...l, { role: "assistant", text: "Thanks. Is there heavy bleeding or trouble breathing?" }]);
    setStep("bleeding");
  }, []);

  const reset = useCallback(() => {
    setLog([{ role: "assistant", text: "Restarted. What’s wrong?" }]);
    setStep("entry");
    setOutcome(null);
  }, []);

  return { log, step, outcome, ask, reset };
}