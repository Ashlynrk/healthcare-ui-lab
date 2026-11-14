import { SLEEP_DURATION_OPTIONS } from "../../lib/checkin";
import type { SleepDuration } from "../../types/models";

export function SleepDurationPicker({
  value,
  onSelect,
}: {
  value?: SleepDuration;
  onSelect: (value: SleepDuration) => void;
}) {
  return (
    <div className="choice-grid" role="group" aria-label="Sleep duration">
      {SLEEP_DURATION_OPTIONS.map((option) => (
        <button
          key={option.id}
          className={value === option.id ? "choice text-choice is-selected" : "choice text-choice"}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onSelect(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
