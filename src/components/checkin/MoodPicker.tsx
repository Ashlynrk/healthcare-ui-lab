import { MOOD_OPTIONS } from "../../lib/checkin";
import type { Mood } from "../../types/models";
import { FaceChoice } from "./FaceChoice";
import { FaceMark } from "./FaceMark";

export function MoodPicker({ value, onSelect }: { value?: Mood; onSelect: (mood: Mood) => void }) {
  return (
    <div className="choice-grid face-grid" role="group" aria-label="Mood">
      {MOOD_OPTIONS.map((option) => (
        <FaceChoice
          key={option.id}
          label={option.label}
          tone={option.tone}
          selected={value === option.id}
          onSelect={() => onSelect(option.id)}
        >
          <FaceMark expression={option.id} />
        </FaceChoice>
      ))}
    </div>
  );
}
