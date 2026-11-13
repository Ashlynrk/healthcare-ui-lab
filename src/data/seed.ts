import { atLocalTime, toISODate, addDays, todayDate } from "../lib/dates";
import type {
  AppState,
  BotherRating,
  CheckIn,
  DoseLog,
  DoseStatus,
  LevelRating,
  Mood,
  SymptomId,
} from "../types/models";
import { SYMPTOMS } from "../types/models";

const HISTORY_DAYS = 14;
const DAY_WORD_QUESTION = "q-day-word";

const DAY_PATTERN: Array<{
  mood: Mood;
  energy: LevelRating;
  stress: LevelRating;
  symptoms: [BotherRating, BotherRating, BotherRating, BotherRating];
  note: string;
  word?: string;
}> = [
  { mood: "good", energy: 4, stress: 2, symptoms: [0, 1, 1, 1], note: "A steady walk after lunch.", word: "light" },
  { mood: "steady", energy: 3, stress: 3, symptoms: [1, 2, 2, 2], note: "" },
  { mood: "uneasy", energy: 2, stress: 4, symptoms: [2, 2, 3, 3], note: "Afternoon felt crowded.", word: "full" },
  { mood: "steady", energy: 3, stress: 2, symptoms: [1, 1, 2, 1], note: "" },
  { mood: "bright", energy: 4, stress: 1, symptoms: [0, 1, 1, 0], note: "Slept through the night.", word: "clear" },
  { mood: "low", energy: 2, stress: 3, symptoms: [3, 2, 4, 3], note: "Kept the day small." },
  { mood: "good", energy: 4, stress: 2, symptoms: [1, 1, 2, 1], note: "" },
  { mood: "steady", energy: 3, stress: 2, symptoms: [0, 2, 2, 2], note: "Wrote a few lines before bed.", word: "quiet" },
  { mood: "uneasy", energy: 2, stress: 4, symptoms: [2, 3, 3, 2], note: "" },
  { mood: "good", energy: 3, stress: 2, symptoms: [1, 1, 1, 1], note: "" },
  { mood: "steady", energy: 3, stress: 3, symptoms: [1, 2, 2, 2], note: "Asked for a slower morning." },
  { mood: "bright", energy: 5, stress: 1, symptoms: [0, 0, 1, 0], note: "", word: "open" },
  { mood: "steady", energy: 3, stress: 2, symptoms: [1, 2, 2, 1], note: "" },
  { mood: "good", energy: 4, stress: 2, symptoms: [0, 1, 2, 1], note: "Left one question for the clinic.", word: "ready" },
];

function doseStatus(dayOffset: number, time: string): DoseStatus {
  if (dayOffset === 0) return "pending";
  if (dayOffset === -4 && time === "08:00") return "missed";
  if (dayOffset === -7 && time === "20:00") return "snoozed";
  return "taken";
}

function symptomRatings(values: [BotherRating, BotherRating, BotherRating, BotherRating]) {
  return SYMPTOMS.map((symptom, index) => ({
    id: symptom.id as SymptomId,
    rating: values[index],
  }));
}

export function createSeed(): AppState {
  const today = todayDate();
  const medications = [
    {
      id: "med-morning",
      name: "Sample Morning Tablet",
      instructions: "Listed instruction (sample): 1 tablet in the morning. This app does not change that instruction.",
      times: ["08:00"],
    },
    {
      id: "med-evening",
      name: "Sample Evening Capsule",
      instructions: "Listed instruction (sample): 1 capsule in the evening. This app does not change that instruction.",
      times: ["20:00"],
    },
  ];

  const checkIns: CheckIn[] = DAY_PATTERN.map((day, index) => {
    const offset = -(HISTORY_DAYS - index);
    const date = toISODate(addDays(today, offset));
    return {
      date,
      mood: day.mood,
      energy: day.energy,
      stress: day.stress,
      symptoms: symptomRatings(day.symptoms),
      answers: day.word ? [{ questionId: DAY_WORD_QUESTION, value: day.word }] : [],
      note: day.note,
      updatedAt: atLocalTime(offset, 21, 0),
    };
  });

  const doses: DoseLog[] = [];
  for (let offset = -HISTORY_DAYS; offset <= 0; offset += 1) {
    const date = toISODate(addDays(today, offset));
    for (const medication of medications) {
      for (const time of medication.times) {
        const status = doseStatus(offset, time);
        doses.push({
          id: `${medication.id}-${date}-${time}`,
          medicationId: medication.id,
          date,
          time,
          status,
          ...(status === "snoozed" ? { snoozeUntil: atLocalTime(offset, 21, 0) } : {}),
        });
      }
    }
  }

  return {
    version: 1,
    profileLabel: "Sample profile",
    preferences: {
      displayName: "Riley Chen",
      showSuggestions: true,
      tone: "warmer",
      hiddenSymptoms: [],
      dismissedSuggestionTypes: [],
    },
    customQuestions: [
      {
        id: DAY_WORD_QUESTION,
        prompt: "One word for today?",
        kind: "text",
        enabled: true,
      },
    ],
    checkIns,
    medications,
    doses,
    appointments: [
      {
        id: "visit-upcoming",
        title: "Routine check-in",
        when: atLocalTime(6, 9, 30),
        location: "Riverside Sample Clinic",
        notes: "Fictional visit. Bring the questions below.",
        results: "",
        questions: ["What should I watch for between visits?"],
      },
      {
        id: "visit-follow-up",
        title: "Follow-up visit",
        when: atLocalTime(-10, 14, 0),
        location: "Riverside Sample Clinic",
        notes: "Fictional note: talked about keeping mornings quieter.",
        results: "Sample result: no new findings in this prototype.",
        questions: ["How do I describe a heavy week without rushing?"],
      },
      {
        id: "visit-planning",
        title: "Care planning visit",
        when: atLocalTime(-24, 11, 0),
        location: "Riverside Sample Clinic",
        notes: "Fictional note: agreed to track mood, energy, and sleep in plain language.",
        results: "Sample lab summary: the numbers here are placeholders, not a real lab report.",
        questions: [],
      },
    ],
    journal: [
      {
        id: "journal-recent",
        date: toISODate(addDays(today, -2)),
        body: "The afternoon was noisy, and a short pause helped. This entry is sample writing.",
        updatedAt: atLocalTime(-2, 19, 30),
      },
      {
        id: "journal-earlier",
        date: toISODate(addDays(today, -9)),
        body: "I want the next visit to feel unhurried. This entry is sample writing.",
        updatedAt: atLocalTime(-9, 20, 15),
      },
    ],
    notes: [
      {
        id: "note-question",
        text: "Write down one question before the sample visit.",
        createdAt: atLocalTime(-1, 18, 0),
      },
      {
        id: "note-evening",
        text: "The evening capsule is listed at 8:00 PM in the sample plan.",
        createdAt: atLocalTime(-3, 12, 0),
      },
    ],
  };
}
