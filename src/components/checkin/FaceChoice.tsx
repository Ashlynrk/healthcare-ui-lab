import type { ReactNode } from "react";

export function FaceChoice({
  label,
  tone,
  selected,
  onSelect,
  children,
}: {
  label: string;
  tone: string;
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      className={selected ? `choice face-choice tone-${tone} is-selected` : `choice face-choice tone-${tone}`}
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}
