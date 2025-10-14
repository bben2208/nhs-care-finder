// apps/web/src/hooks/useTriage.ts
import { useCallback, useMemo, useState } from "react";

export type Outcome = "CALL_999" | "A_AND_E" | "UTC_GP" | "SELF_CARE";
export type StepType = "yesno" | "single" | "number";
export type AgeBand = "INFANT" | "CHILD" | "ADULT" | "OLDER";

export type Step = {
  id: string;
  text: string;
  type: StepType;
  options?: { value: string; label: string }[];
};

type State = {
  forWhom?: "ME" | "OTHER";
  age?: AgeBand;
  complaint?: "BLEEDING" | "INJURY" | "CHEST_BREATH" | "STROKE" | "ABDO" | "FEVER" | "EYE" | "URINARY" | "MENTAL" | "OTHER";
  // red flags
  rfUnconscious?: boolean;
  rfSevereBleeding?: boolean;
  rfBreathing?: boolean;
  rfChestPain?: boolean;
  rfStroke?: boolean;
  rfSeizure?: boolean;
  rfAnaphylaxis?: boolean;
  rfMajorTrauma?: boolean;
  rfPregEmerg?: boolean;
  rfSuicide?: boolean;

  // complaint-specific flags (a tiny subset for demo)
  rfOpenFracture?: boolean;
  rfDeformity?: boolean;
  rfCantWeightBear?: boolean;
  rfHeadInjuryRisk?: boolean;

  // general
  painScore?: number;
  durationHours?: number;
};

export function useTriage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<State>({});
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const steps: Step[] = useMemo<Step[]>(() => [
    { id: "who", text: "Are you asking for yourself?", type: "single", options: [
      { value: "ME", label: "Yes, myself" }, { value: "OTHER", label: "No, someone else" }
    ]},
    { id: "age", text: "How old is the person?", type: "single", options: [
      { value: "INFANT", label: "Under 1 year" },
      { value: "CHILD",  label: "1–15 years" },
      { value: "ADULT",  label: "16–64 years" },
      { value: "OLDER",  label: "65+ years" }
    ]},

    // immediate red flags (any yes → 999)
    { id: "rfUnconscious",  text: "Are they unconscious, very drowsy, or confused?", type: "yesno" },
    { id: "rfSevereBleeding", text: "Is there severe bleeding that doesn't stop with pressure?", type: "yesno" },
    { id: "rfBreathing",    text: "Are they struggling to breathe or lips/face turning blue/grey?", type: "yesno" },
    { id: "rfChestPain",    text: "Severe chest pain (crushing/tight) lasting >15 minutes?", type: "yesno" },
    { id: "rfStroke",       text: "Possible stroke (FAST: face droop, arm weakness, slurred speech)?", type: "yesno" },
    { id: "rfSeizure",      text: "Seizure now or repeated seizures?", type: "yesno" },
    { id: "rfAnaphylaxis",  text: "Severe allergic reaction with swelling or breathing trouble?", type: "yesno" },
    { id: "rfMajorTrauma",  text: "Major trauma (car crash, big fall) or bone visible?", type: "yesno" },
    { id: "rfPregEmerg",    text: "Heavy bleeding in pregnancy or severe abdominal pain?", type: "yesno" },
    { id: "rfSuicide",      text: "Immediate risk of self-harm or suicide?", type: "yesno" },

    // complaint selection
    { id: "complaint", text: "What is the main problem today?", type: "single", options: [
      { value: "BLEEDING", label: "Bleeding / wound" },
      { value: "INJURY", label: "Injury / fall / limb pain" },
      { value: "CHEST_BREATH", label: "Chest pain / breathing" },
      { value: "STROKE", label: "Stroke concern" },
      { value: "ABDO", label: "Abdominal pain / vomiting" },
      { value: "FEVER", label: "Fever / infection" },
      { value: "EYE", label: "Eye problem" },
      { value: "URINARY", label: "Urinary symptoms" },
      { value: "MENTAL", label: "Mental health" },
      { value: "OTHER", label: "Other" },
    ]},

    // complaint-specific (demo: INJURY subset)
    { id: "rfOpenFracture", text: "Is there an open wound over a broken bone, or bone visible?", type: "yesno" },
    { id: "rfDeformity",    text: "Is the limb severely deformed or out of place?", type: "yesno" },
    { id: "rfCantWeightBear", text: "Can they NOT bear weight or move the joint at all?", type: "yesno" },
    { id: "rfHeadInjuryRisk", text: "Head injury with loss of consciousness, vomiting, or on blood thinners?", type: "yesno" },

    // general severity
    { id: "painScore", text: "Pain from 0 to 10?", type: "number" },
    { id: "durationHours", text: "How many hours since this started?", type: "number" },
  ], []);

  const go = useCallback((step: Step, raw: string | boolean | number) => {
    // persist answer
    setAnswers(prev => {
      const next = { ...prev };
      switch (step.id) {
        case "who": next.forWhom = (raw as string) === "ME" ? "ME" : "OTHER"; break;
        case "age": next.age = raw as AgeBand; break;
        case "complaint": next.complaint = raw as State["complaint"]; break;
        default:
          // booleans or numbers
          if (step.type === "yesno") (next as any)[step.id] = Boolean(raw);
          if (step.type === "number") (next as any)[step.id] = Number(raw);
      }
      return next;
    });

    // decision logic runs on the value we just got; we inspect current + incoming
    setOutcome(prevOutcome => {
      if (prevOutcome) return prevOutcome; // already decided

      // Immediate red flags → 999
      const redFlagIds = ["rfUnconscious","rfSevereBleeding","rfBreathing","rfChestPain","rfStroke","rfSeizure","rfAnaphylaxis","rfMajorTrauma","rfPregEmerg","rfSuicide"];
      if (redFlagIds.includes(step.id) && raw === true) {
        return "CALL_999";
      }
      return null;
    });

    setStepIndex((i) => {
      // early stop if outcome decided
      const decide999OnThis = ["rfUnconscious","rfSevereBleeding","rfBreathing","rfChestPain","rfStroke","rfSeizure","rfAnaphylaxis","rfMajorTrauma","rfPregEmerg","rfSuicide"].includes(step.id) && raw === true;
      if (decide999OnThis) return i; // keep index; UI will show outcome

      // otherwise progress
      const nextIdx = i + 1;

      // if we just chose complaint, we can branch: for demo only INJURY has follow-up; others jump to severity
      if (step.id === "complaint") {
        const complaint = raw as State["complaint"];
        if (complaint === "INJURY") {
          // next step is rfOpenFracture (already nextIdx)
          return nextIdx;
        } else {
          // skip the 4 injury-specific questions
          const afterInjuryBlock = steps.findIndex(s => s.id === "painScore");
          return afterInjuryBlock;
        }
      }

      // if we just finished last injury flag, keep going to severity
      if (step.id === "rfHeadInjuryRisk") return nextIdx;

      // end of flow? compute default outcome
      if (nextIdx >= steps.length) return i; // will compute outcome below (in computeOutcome)

      return nextIdx;
    });
  }, [steps]);

  // compute a non-999 outcome once we reach or pass severity steps
  useEffectComputeOutcome(answers, steps, stepIndex, setOutcome);

  const reset = useCallback(() => {
    setStepIndex(0);
    setAnswers({});
    setOutcome(null);
  }, []);

  return {
    steps,
    stepIndex,
    step: steps[stepIndex],
    answers,
    outcome,
    go,
    reset,
  };
}

// Separate tiny hook to compute outcome based on answers (non-999 paths)
function useEffectComputeOutcome(
  answers: any,
  steps: Step[],
  stepIndex: number,
  setOutcome: (o: Outcome | null) => void
) {
  // naive synchronous “effect”: recompute when inputs change
  const decide = () => {
    // If already decided 999 (setOutcome previously), do nothing.
    // Else: complaint-specific routing
    if (!answers) return;

    // A few examples:
    if (answers.complaint === "INJURY") {
      if (answers.rfOpenFracture || answers.rfDeformity || answers.rfHeadInjuryRisk) {
        setOutcome("A_AND_E");
        return;
      }
      if (answers.rfCantWeightBear) {
        setOutcome("UTC_GP");
        return;
      }
    }

    if (answers.complaint === "CHEST_BREATH" || answers.complaint === "STROKE") {
      // If they made it here without red-flag yes, still err on A&E
      setOutcome("A_AND_E");
      return;
    }

    if (answers.complaint === "ABDO") {
      if (answers.painScore >= 7) { setOutcome("A_AND_E"); return; }
      setOutcome("UTC_GP"); return;
    }

    if (answers.complaint === "FEVER") {
      setOutcome("UTC_GP"); return;
    }

    if (answers.complaint === "EYE") {
      setOutcome("A_AND_E"); return;
    }

    if (answers.complaint === "URINARY") {
      setOutcome("UTC_GP"); return;
    }

    if (answers.complaint === "MENTAL") {
      setOutcome("UTC_GP"); return;
    }

    // Default if nothing matched:
    setOutcome("SELF_CARE");
  };

  // Run decision once we've passed or at least reached the severity questions
  const severityStart = steps.findIndex(s => s.id === "painScore");
  if (severityStart !== -1 && stepIndex >= severityStart) {
    decide();
  }
}