import { useState } from "react";
import { BUILTIN_SYMPTOMS } from "../../lib/checkin";
import type { SymptomDefinition } from "../../types/models";
import { SymptomIcon } from "./SymptomIcon";

export function SymptomPicker({
  selectedIds,
  noneToday,
  catalog,
  onToggle,
  onNone,
  onAdd,
  onContinue,
}: {
  selectedIds: string[];
  noneToday: boolean;
  catalog: SymptomDefinition[];
  onToggle: (id: string) => void;
  onNone: () => void;
  onAdd: (label: string) => void;
  onContinue: () => void;
}) {
  const [draft, setDraft] = useState("");
  const options = [...BUILTIN_SYMPTOMS, ...catalog];

  return (
    <div className="symptom-block">
      <div className="choice-grid symptom-grid" role="group" aria-label="Physical symptoms">
        {options.map((option) => {
          const selected = selectedIds.includes(option.id);
          return (
            <button
              key={option.id}
              className={selected ? "choice symptom-choice is-selected" : "choice symptom-choice"}
              type="button"
              aria-pressed={selected}
              onClick={() => onToggle(option.id)}
            >
              <SymptomIcon id={option.id} />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
      <button
        className={noneToday ? "choice text-choice is-selected" : "choice text-choice"}
        type="button"
        aria-pressed={noneToday}
        onClick={onNone}
      >
        None today
      </button>
      <form
        className="custom-symptom"
        onSubmit={(event) => {
          event.preventDefault();
          const label = draft.trim();
          if (!label) return;
          onAdd(label);
          setDraft("");
        }}
      >
        <label htmlFor="custom-symptom">Add a symptom</label>
        <div className="custom-symptom-row">
          <input
            id="custom-symptom"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={40}
          />
          <button className="button secondary" type="submit">
            Add
          </button>
        </div>
      </form>
      <button className="button secondary" type="button" onClick={onContinue} disabled={selectedIds.length === 0}>
        Continue
      </button>
    </div>
  );
}
