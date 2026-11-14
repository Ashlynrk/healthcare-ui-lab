import { ENERGY_OPTIONS } from "../../lib/checkin";
import type { LevelRating } from "../../types/models";

export function EnergySun({
  value,
  onSelect,
}: {
  value?: LevelRating;
  onSelect: (value: LevelRating) => void;
}) {
  return (
    <div className="choice-grid energy-grid" role="group" aria-label="Energy">
      {ENERGY_OPTIONS.map((option) => (
        <button
          key={option.id}
          className={value === option.id ? "choice energy-choice is-selected" : "choice energy-choice"}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onSelect(option.id)}
        >
          <SunGlyph level={option.id} />
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}

function SunGlyph({ level }: { level: LevelRating }) {
  const cy = 58 - level * 8;
  const radius = 4 + level * 2;
  const rays = level;
  return (
    <svg className="sun-mark" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M6 54h52" />
      <circle cx="32" cy={cy} r={radius} />
      {Array.from({ length: rays }, (_, index) => {
        const angle = Math.PI + (Math.PI * (index + 1)) / (rays + 1);
        const x1 = 32 + Math.cos(angle) * (radius + 2);
        const y1 = cy + Math.sin(angle) * (radius + 2);
        const x2 = 32 + Math.cos(angle) * (radius + 7);
        const y2 = cy + Math.sin(angle) * (radius + 7);
        return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </svg>
  );
}
