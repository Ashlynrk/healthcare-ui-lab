import { SLEEP_QUALITY_OPTIONS } from "../../lib/checkin";
import type { LevelRating } from "../../types/models";
import { FaceChoice } from "./FaceChoice";
import { FaceMark } from "./FaceMark";

export function SleepQualityPicker({
  value,
  onSelect,
}: {
  value?: LevelRating;
  onSelect: (value: LevelRating) => void;
}) {
  return (
    <div className="choice-grid face-grid" role="group" aria-label="Sleep quality">
      {SLEEP_QUALITY_OPTIONS.map((option) => (
        <FaceChoice
          key={option.id}
          label={option.label}
          tone={option.tone}
          selected={value === option.id}
          onSelect={() => onSelect(option.id)}
        >
          <FaceMark expression={`sleep-${option.id}`} />
        </FaceChoice>
      ))}
    </div>
  );
}
