import { useEffect, useRef } from "react";
import { BUILTIN_SYMPTOMS, CHECK_IN_STEPS, answerLabel, stepTitle } from "../../lib/checkin";
import { encouragementFor, suggestionsFor } from "../../lib/support";
import type { CheckIn, CheckInStep, SuggestionTone, SymptomDefinition } from "../../types/models";

export function CheckInComplete({
  entry,
  tone,
  showSuggestions,
  dismissed,
  catalog,
  onEdit,
  onDismiss,
}: {
  entry: CheckIn;
  tone: SuggestionTone;
  showSuggestions: boolean;
  dismissed: string[];
  catalog: SymptomDefinition[];
  onEdit: (step: CheckInStep) => void;
  onDismiss: (id: string) => void;
}) {
  const suggestions = showSuggestions ? suggestionsFor(entry, dismissed) : [];
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  function symptomLabel(id: string) {
    return (
      BUILTIN_SYMPTOMS.find((item) => item.id === id)?.label ??
      catalog.find((item) => item.id === id)?.label ??
      id
    );
  }

  return (
    <section className="panel checkin-panel" aria-labelledby="checkin-complete">
      <p className="eyebrow">Today</p>
      <h2 id="checkin-complete" ref={headingRef} tabIndex={-1}>
        Today is saved
      </h2>
      <p className="lede">{encouragementFor(entry, tone)}</p>
      {suggestions.length > 0 ? (
        <ul className="suggestion-list">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id}>
              <p>{suggestion.text}</p>
              <button className="button quiet" type="button" onClick={() => onDismiss(suggestion.id)}>
                Dismiss
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <ul className="answer-list">
        {CHECK_IN_STEPS.map((step) => (
          <li key={step}>
            <div>
              <p className="eyebrow">{stepTitle(step)}</p>
              <p>{answerLabel(entry, step, symptomLabel)}</p>
            </div>
            <button className="button secondary" type="button" aria-label={`Change ${stepTitle(step)}`} onClick={() => onEdit(step)}>
              Change
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
