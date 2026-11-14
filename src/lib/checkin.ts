import type { CheckIn, CheckInStep, LevelRating, Mood, SleepDuration } from "../types/models";

export const CHECK_IN_STEPS: CheckInStep[] = [
  "mood",
  "sleepDuration",
  "sleepQuality",
  "stress",
  "energy",
  "symptoms",
  "reflection",
];

export const MOOD_OPTIONS: { id: Mood; label: string; tone: string }[] = [
  { id: "low", label: "Low", tone: "low" },
  { id: "uneasy", label: "Uneasy", tone: "uneasy" },
  { id: "steady", label: "Steady", tone: "steady" },
  { id: "good", label: "Good", tone: "good" },
  { id: "bright", label: "Bright", tone: "bright" },
];

export const SLEEP_DURATION_OPTIONS: { id: SleepDuration; label: string }[] = [
  { id: "under-5", label: "Under 5 hours" },
  { id: "5-6", label: "5–6 hours" },
  { id: "7-8", label: "7–8 hours" },
  { id: "9-plus", label: "9 hours or more" },
  { id: "unsure", label: "Not sure" },
];

export const SLEEP_QUALITY_OPTIONS: { id: LevelRating; label: string; tone: string }[] = [
  { id: 1, label: "Restless", tone: "low" },
  { id: 2, label: "Broken", tone: "uneasy" },
  { id: 3, label: "Okay", tone: "steady" },
  { id: 4, label: "Sound", tone: "good" },
  { id: 5, label: "Refreshed", tone: "bright" },
];

export const STRESS_OPTIONS: { id: LevelRating; label: string; tone: string }[] = [
  { id: 1, label: "Calm", tone: "bright" },
  { id: 2, label: "Uneasy", tone: "good" },
  { id: 3, label: "Tense", tone: "steady" },
  { id: 4, label: "Stressed", tone: "uneasy" },
  { id: 5, label: "Overloaded", tone: "low" },
];

export const ENERGY_OPTIONS: { id: LevelRating; label: string }[] = [
  { id: 1, label: "Drained" },
  { id: 2, label: "Low" },
  { id: 3, label: "Steady" },
  { id: 4, label: "Lifted" },
  { id: 5, label: "Bright" },
];

export const BUILTIN_SYMPTOMS: { id: string; label: string }[] = [
  { id: "headache", label: "Headache" },
  { id: "pain", label: "Pain" },
  { id: "fatigue", label: "Fatigue" },
  { id: "stomach", label: "Stomach" },
  { id: "dizziness", label: "Dizziness" },
];

export function stepTitle(step: CheckInStep): string {
  switch (step) {
    case "mood":
      return "How is your mood?";
    case "sleepDuration":
      return "How long did you sleep?";
    case "sleepQuality":
      return "How did that sleep feel?";
    case "stress":
      return "How is stress sitting today?";
    case "energy":
      return "Where is your energy?";
    case "symptoms":
      return "Any physical symptoms?";
    case "reflection":
      return "A note for today";
  }
}

export function isStepAnswered(entry: CheckIn | undefined, step: CheckInStep): boolean {
  if (!entry) return false;
  switch (step) {
    case "mood":
      return Boolean(entry.mood);
    case "sleepDuration":
      return Boolean(entry.sleepDuration);
    case "sleepQuality":
      return entry.sleepQuality != null;
    case "stress":
      return entry.stress != null;
    case "energy":
      return entry.energy != null;
    case "symptoms":
      return Boolean(entry.symptomsConfirmed || entry.symptomsNone);
    case "reflection":
      return Boolean(entry.note?.trim());
  }
}

export function resumeStep(entry: CheckIn | undefined): CheckInStep | "complete" {
  if (!entry) return "mood";
  if (entry.completedAt) return "complete";
  const skipped = entry.skipped ?? [];
  for (const step of CHECK_IN_STEPS) {
    if (!isStepAnswered(entry, step) && !skipped.includes(step)) return step;
  }
  return "complete";
}

export function nextStep(step: CheckInStep): CheckInStep | "complete" {
  const index = CHECK_IN_STEPS.indexOf(step);
  return CHECK_IN_STEPS[index + 1] ?? "complete";
}

export function previousStep(step: CheckInStep): CheckInStep | null {
  const index = CHECK_IN_STEPS.indexOf(step);
  return index > 0 ? CHECK_IN_STEPS[index - 1] : null;
}

export function withoutStep(skipped: CheckInStep[] | undefined, step: CheckInStep): CheckInStep[] {
  return (skipped ?? []).filter((item) => item !== step);
}

export function withStep(skipped: CheckInStep[] | undefined, step: CheckInStep): CheckInStep[] {
  return Array.from(new Set([...(skipped ?? []), step]));
}

export function answerLabel(entry: CheckIn | undefined, step: CheckInStep, symptomLabel: (id: string) => string): string {
  if (!entry) return "Not answered";
  if ((entry.skipped ?? []).includes(step) && !isStepAnswered(entry, step)) return "Skipped";
  switch (step) {
    case "mood":
      return MOOD_OPTIONS.find((option) => option.id === entry.mood)?.label ?? "Not answered";
    case "sleepDuration":
      return SLEEP_DURATION_OPTIONS.find((option) => option.id === entry.sleepDuration)?.label ?? "Not answered";
    case "sleepQuality":
      return SLEEP_QUALITY_OPTIONS.find((option) => option.id === entry.sleepQuality)?.label ?? "Not answered";
    case "stress":
      return STRESS_OPTIONS.find((option) => option.id === entry.stress)?.label ?? "Not answered";
    case "energy":
      return ENERGY_OPTIONS.find((option) => option.id === entry.energy)?.label ?? "Not answered";
    case "symptoms":
      if (entry.symptomsNone) return "None today";
      if ((entry.selectedSymptomIds?.length ?? 0) > 0) {
        return entry.selectedSymptomIds!.map(symptomLabel).join(", ");
      }
      return "Not answered";
    case "reflection":
      return entry.note?.trim() || "Not answered";
  }
}
