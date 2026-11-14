import { createSeed } from "./seed";
import type { AppState } from "../types/models";

export const STORAGE_KEY = "hul.v1";

function isAppState(value: unknown): value is AppState {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<AppState>;
  return (
    record.version === 1 &&
    record.profileLabel === "Sample profile" &&
    !!record.preferences &&
    Array.isArray(record.customQuestions) &&
    Array.isArray(record.checkIns) &&
    Array.isArray(record.medications) &&
    Array.isArray(record.doses) &&
    Array.isArray(record.appointments) &&
    Array.isArray(record.journal) &&
    Array.isArray(record.notes)
  );
}

export function loadState(): AppState {
  if (typeof localStorage === "undefined") return createSeed();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return persist(createSeed());
    const parsed: unknown = JSON.parse(raw);
    if (!isAppState(parsed)) return persist(createSeed());
    return {
      ...parsed,
      symptomCatalog: Array.isArray(parsed.symptomCatalog) ? parsed.symptomCatalog : [],
    };
  } catch {
    return persist(createSeed());
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function freshState(): AppState {
  return persist(createSeed());
}

function persist(state: AppState): AppState {
  saveState(state);
  return state;
}
