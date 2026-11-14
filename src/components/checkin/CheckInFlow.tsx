import { useEffect, useRef, useState } from "react";
import { toISODate, todayDate } from "../../lib/dates";
import {
  BUILTIN_SYMPTOMS,
  CHECK_IN_STEPS,
  nextStep,
  previousStep,
  resumeStep,
  stepTitle,
  withStep,
  withoutStep,
} from "../../lib/checkin";
import { promptForDate } from "../../lib/prompts";
import { useAppState } from "../../state/AppStateProvider";
import type {
  AppState,
  CheckIn,
  CheckInStep,
  LevelRating,
  Mood,
  SleepDuration,
  SymptomDefinition,
} from "../../types/models";
import { CheckInComplete } from "./CheckInComplete";
import { EnergySun } from "./EnergySun";
import { MoodPicker } from "./MoodPicker";
import { ProgressIndicator } from "./ProgressIndicator";
import { QuestionFrame } from "./QuestionFrame";
import { ReflectionPrompt } from "./ReflectionPrompt";
import { SleepDurationPicker } from "./SleepDurationPicker";
import { SleepQualityPicker } from "./SleepQualityPicker";
import { StressPicker } from "./StressPicker";
import { SymptomPicker } from "./SymptomPicker";

type Screen = CheckInStep | "complete";

export function CheckInFlow() {
  const { state, update } = useAppState();
  const today = toISODate(todayDate());
  const entry = state.checkIns.find((item) => item.date === today);
  const [screen, setScreen] = useState<Screen>(() => resumeStep(entry));
  const [editing, setEditing] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function save(recipe: (current: AppState, existing: CheckIn | undefined) => AppState) {
    update((current) => {
      const existing = current.checkIns.find((item) => item.date === today);
      return recipe(current, existing);
    });
  }

  function writeToday(patch: Partial<CheckIn>, catalog?: SymptomDefinition[]) {
    save((current, existing) => {
      const next: CheckIn = {
        answers: [],
        note: "",
        ...existing,
        ...patch,
        date: today,
        updatedAt: new Date().toISOString(),
      };
      const checkIns = existing
        ? current.checkIns.map((item) => (item.date === today ? next : item))
        : [...current.checkIns, next];
      return {
        ...current,
        symptomCatalog: catalog ?? current.symptomCatalog ?? [],
        checkIns,
      };
    });
  }

  function advance(step: CheckInStep) {
    if (editing) {
      setEditing(false);
      setScreen("complete");
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const following = nextStep(step);
      setScreen(following);
      if (following === "complete") {
        writeToday({ completedAt: new Date().toISOString() });
      }
    }, reduce ? 0 : 420);
  }

  function answer(step: CheckInStep, patch: Partial<CheckIn>, catalog?: SymptomDefinition[]) {
    writeToday(
      {
        ...patch,
        skipped: withoutStep(entry?.skipped, step),
      },
      catalog,
    );
    advance(step);
  }

  function skip(step: CheckInStep) {
    const cleared: Partial<CheckIn> = { skipped: withStep(entry?.skipped, step) };
    if (step === "mood") cleared.mood = undefined;
    if (step === "sleepDuration") cleared.sleepDuration = undefined;
    if (step === "sleepQuality") cleared.sleepQuality = undefined;
    if (step === "stress") cleared.stress = undefined;
    if (step === "energy") cleared.energy = undefined;
    if (step === "symptoms") {
      cleared.selectedSymptomIds = [];
      cleared.symptomsNone = false;
      cleared.symptomsConfirmed = false;
    }
    if (step === "reflection") cleared.note = "";
    writeToday(cleared);
    if (timer.current) window.clearTimeout(timer.current);
    if (editing) {
      setEditing(false);
      setScreen("complete");
      return;
    }
    const following = nextStep(step);
    setScreen(following);
    if (following === "complete") writeToday({ ...cleared, completedAt: new Date().toISOString() });
  }

  function goBack() {
    if (timer.current) window.clearTimeout(timer.current);
    if (editing || screen === "complete") {
      setEditing(false);
      setScreen("complete");
      return;
    }
    const previous = previousStep(screen);
    if (previous) setScreen(previous);
  }

  if (screen === "complete" && entry) {
    return (
      <CheckInComplete
        entry={entry}
        tone={state.preferences.tone}
        showSuggestions={state.preferences.showSuggestions}
        dismissed={state.preferences.dismissedSuggestionTypes}
        catalog={state.symptomCatalog ?? []}
        onEdit={(step) => {
          setEditing(true);
          setScreen(step);
        }}
        onDismiss={(id) => {
          update((current) => ({
            ...current,
            preferences: {
              ...current.preferences,
              dismissedSuggestionTypes: Array.from(
                new Set([...current.preferences.dismissedSuggestionTypes, id]),
              ),
            },
          }));
        }}
      />
    );
  }

  if (screen === "complete") return null;

  const step = screen;
  const index = CHECK_IN_STEPS.indexOf(step) + 1;

  return (
    <>
      <ProgressIndicator current={index} total={CHECK_IN_STEPS.length} />
      <QuestionFrame
        title={stepTitle(step)}
        progress={editing ? "Updating today’s answer" : `Step ${index} of ${CHECK_IN_STEPS.length}`}
        backLabel={editing ? "Back to summary" : "Back"}
        onBack={editing || previousStep(step) ? goBack : undefined}
        onSkip={() => skip(step)}
      >
        {step === "mood" ? (
          <MoodPicker value={entry?.mood} onSelect={(mood: Mood) => answer(step, { mood })} />
        ) : null}
        {step === "sleepDuration" ? (
          <SleepDurationPicker
            value={entry?.sleepDuration}
            onSelect={(sleepDuration: SleepDuration) => answer(step, { sleepDuration })}
          />
        ) : null}
        {step === "sleepQuality" ? (
          <SleepQualityPicker
            value={entry?.sleepQuality}
            onSelect={(sleepQuality: LevelRating) => answer(step, { sleepQuality })}
          />
        ) : null}
        {step === "stress" ? (
          <StressPicker
            value={entry?.stress}
            onSelect={(stress: LevelRating) => answer(step, { stress })}
          />
        ) : null}
        {step === "energy" ? (
          <EnergySun
            value={entry?.energy}
            onSelect={(energy: LevelRating) => answer(step, { energy })}
          />
        ) : null}
        {step === "symptoms" ? (
          <SymptomPicker
            selectedIds={entry?.selectedSymptomIds ?? []}
            noneToday={Boolean(entry?.symptomsNone)}
            catalog={state.symptomCatalog ?? []}
            onToggle={(id) => toggleSymptom(id)}
            onNone={() =>
              answer(step, {
                selectedSymptomIds: [],
                symptomsNone: true,
                symptomsConfirmed: true,
              })
            }
            onAdd={(label) => addSymptom(label)}
            onContinue={() =>
              answer(step, {
                symptomsConfirmed: true,
                symptomsNone: false,
              })
            }
          />
        ) : null}
        {step === "reflection" ? (
          <ReflectionPrompt
            key={entry?.note ?? "new"}
            prompt={promptForDate(today).text}
            value={entry?.note ?? ""}
            onSave={(note) =>
              answer(step, {
                note,
                reflectionPromptId: promptForDate(today).id,
              })
            }
          />
        ) : null}
      </QuestionFrame>
    </>
  );

  function toggleSymptom(id: string) {
    const selected = entry?.selectedSymptomIds ?? [];
    const nextIds = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
    writeToday({
      selectedSymptomIds: nextIds,
      symptomsNone: false,
      symptomsConfirmed: false,
      skipped: withoutStep(entry?.skipped, "symptoms"),
    });
  }

  function addSymptom(label: string) {
    const normalized = label.trim();
    if (!normalized) return;
    const catalog = state.symptomCatalog ?? [];
    const existing =
      BUILTIN_SYMPTOMS.find((item) => item.label.toLowerCase() === normalized.toLowerCase()) ??
      catalog.find((item) => item.label.toLowerCase() === normalized.toLowerCase());
    const definition: SymptomDefinition = existing ?? {
      id: `symptom-${Date.now()}`,
      label: normalized,
    };
    const nextCatalog = existing ? catalog : [...catalog, definition];
    const selected = entry?.selectedSymptomIds ?? [];
    writeToday(
      {
        selectedSymptomIds: selected.includes(definition.id) ? selected : [...selected, definition.id],
        symptomsNone: false,
        symptomsConfirmed: false,
        skipped: withoutStep(entry?.skipped, "symptoms"),
      },
      nextCatalog,
    );
  }
}
