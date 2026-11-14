import { useState } from "react";

export function ReflectionPrompt({
  prompt,
  value,
  onSave,
}: {
  prompt: string;
  value: string;
  onSave: (note: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  return (
    <form
      className="reflection"
      onSubmit={(event) => {
        event.preventDefault();
        if (!draft.trim()) return;
        onSave(draft.trim());
      }}
    >
      <label htmlFor="reflection-note">{prompt}</label>
      <textarea
        id="reflection-note"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        rows={4}
        maxLength={600}
      />
      <button className="button secondary" type="submit" disabled={!draft.trim()}>
        Save and continue
      </button>
    </form>
  );
}
