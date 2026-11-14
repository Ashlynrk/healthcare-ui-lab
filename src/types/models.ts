/** 0 means it was not noticeable. 5 means it was very noticeable. */
export type BotherRating = 0 | 1 | 2 | 3 | 4 | 5;

/** 1 is very low. 5 is very high. */
export type LevelRating = 1 | 2 | 3 | 4 | 5;

export type Mood = "low" | "uneasy" | "steady" | "good" | "bright";

export type SymptomId = "headache" | "pain" | "fatigue" | "sleep";

export type SleepDuration = "under-5" | "5-6" | "7-8" | "9-plus" | "unsure";

export type CheckInStep =
  | "mood"
  | "sleepDuration"
  | "sleepQuality"
  | "stress"
  | "energy"
  | "symptoms"
  | "reflection";

export type CustomQuestionKind = "rating" | "text";

export type DoseStatus = "pending" | "taken" | "missed" | "snoozed";

export type SuggestionTone = "brief" | "warmer";

export interface SymptomRating {
  id: SymptomId;
  rating: BotherRating;
}

export interface CustomQuestion {
  id: string;
  prompt: string;
  kind: CustomQuestionKind;
  enabled: boolean;
}

export interface CustomAnswer {
  questionId: string;
  value: number | string;
}

export interface SymptomDefinition {
  id: string;
  label: string;
}

export interface CheckIn {
  date: string;
  mood?: Mood;
  energy?: LevelRating;
  stress?: LevelRating;
  /** Original 0–5 sample ratings. New check-ins leave this list as they found it. */
  symptoms?: SymptomRating[];
  /** Ids from the built-in list or the profile catalog. */
  selectedSymptomIds?: string[];
  symptomsNone?: boolean;
  /** True after Continue or None today, so a refresh can tell a finished symptom step from a pause. */
  symptomsConfirmed?: boolean;
  sleepDuration?: SleepDuration;
  sleepQuality?: LevelRating;
  answers?: CustomAnswer[];
  note?: string;
  reflectionPromptId?: string;
  skipped?: CheckInStep[];
  completedAt?: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  name: string;
  instructions: string;
  times: string[];
}

export interface DoseLog {
  id: string;
  medicationId: string;
  date: string;
  time: string;
  status: DoseStatus;
  snoozeUntil?: string;
}

export interface Appointment {
  id: string;
  title: string;
  when: string;
  location: string;
  notes: string;
  results: string;
  questions: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  body: string;
  updatedAt: string;
}

export interface NoteItem {
  id: string;
  text: string;
  createdAt: string;
}

export interface Preferences {
  displayName: string;
  showSuggestions: boolean;
  tone: SuggestionTone;
  hiddenSymptoms: SymptomId[];
  dismissedSuggestionTypes: string[];
}

export interface AppState {
  version: 1;
  profileLabel: "Sample profile";
  preferences: Preferences;
  customQuestions: CustomQuestion[];
  /** Custom symptoms added by the person. Built-in symptoms are not copied here. */
  symptomCatalog: SymptomDefinition[];
  checkIns: CheckIn[];
  medications: Medication[];
  doses: DoseLog[];
  appointments: Appointment[];
  journal: JournalEntry[];
  notes: NoteItem[];
}

export const SYMPTOMS: { id: SymptomId; label: string }[] = [
  { id: "headache", label: "Headache" },
  { id: "pain", label: "Pain" },
  { id: "fatigue", label: "Fatigue" },
  { id: "sleep", label: "Sleep" },
];
