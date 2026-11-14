import { STRESS_OPTIONS } from "../../lib/checkin";
import type { LevelRating } from "../../types/models";

export function StressPicker({
  value,
  onSelect,
}: {
  value?: LevelRating;
  onSelect: (value: LevelRating) => void;
}) {
  return (
    <div className="choice-grid stress-grid" role="group" aria-label="Stress">
      {STRESS_OPTIONS.map((option) => (
        <button
          key={option.id}
          className={
            value === option.id
              ? `choice stress-choice tone-${option.tone} is-selected`
              : `choice stress-choice tone-${option.tone}`
          }
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onSelect(option.id)}
        >
          <span className="stress-swatch" aria-hidden="true" />
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
