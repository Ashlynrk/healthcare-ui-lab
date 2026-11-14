import type { CheckIn, SuggestionTone } from "../types/models";

/** Shown when someone marks a dose missed. This sentence stays fixed. */
export const MISSED_DOSE_NOTE =
  "This is a record of what you marked. Follow the instructions you were given, or ask your clinic or pharmacist. This app does not decide whether to take a late dose.";

export interface Suggestion {
  id: string;
  text: string;
}

export function encouragementFor(entry: CheckIn, tone: SuggestionTone): string {
  const warmer = tone === "warmer";
  if (entry.mood === "low" || entry.mood === "uneasy") {
    return warmer
      ? "Today can stay small. Checking in is enough for this page."
      : "Today can stay small.";
  }
  if ((entry.stress ?? 0) >= 4) {
    return warmer
      ? "The stress you marked is noted. Nothing here needs to be solved at once."
      : "The stress you marked is noted.";
  }
  if ((entry.energy ?? 5) <= 2) {
    return warmer
      ? "Low energy is worth respecting. A slower pace is a reasonable plan."
      : "Low energy is worth respecting.";
  }
  if (entry.sleepDuration === "under-5" || (entry.sleepQuality ?? 5) <= 2) {
    return warmer
      ? "Rest was hard. Be gentle with the day, and let it stay simple."
      : "Rest was hard. Be gentle with the day.";
  }
  if (entry.mood === "bright" || entry.mood === "good") {
    return warmer
      ? "You marked a lighter mood. Keep whatever part of that feels useful."
      : "You marked a lighter mood.";
  }
  return warmer
    ? "Today’s check-in is saved in this browser. You can change any answer."
    : "Today’s check-in is saved.";
}

export function suggestionsFor(entry: CheckIn, dismissed: string[]): Suggestion[] {
  const pool: Suggestion[] = [];
  if ((entry.energy ?? 3) <= 2 || entry.sleepDuration === "under-5" || (entry.sleepQuality ?? 5) <= 2) {
    pool.push({ id: "pause", text: "A short pause, or a glass of water, is enough for now." });
  }
  if ((entry.stress ?? 0) >= 4) {
    pool.push({ id: "one-line", text: "If it helps, leave the reflection as one honest line." });
  }
  if ((entry.selectedSymptomIds?.length ?? 0) > 0) {
    pool.push({
      id: "visit",
      text: "You can bring these notes to your next sample visit. This app will not interpret them.",
    });
  }
  if (pool.length === 0) {
    pool.push({ id: "pace", text: "One small plan for the rest of the day is plenty." });
  }
  return pool.filter((item) => !dismissed.includes(item.id)).slice(0, 2);
}
