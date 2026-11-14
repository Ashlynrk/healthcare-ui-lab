import { useEffect, useRef, type ReactNode } from "react";

export function QuestionFrame({
  title,
  progress,
  backLabel,
  onBack,
  onSkip,
  children,
}: {
  title: string;
  progress: string;
  backLabel: string;
  onBack?: () => void;
  onSkip?: () => void;
  children: ReactNode;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [title]);

  return (
    <section className="panel checkin-panel" aria-labelledby="checkin-question">
      <p className="eyebrow">{progress}</p>
      <h2 id="checkin-question" ref={headingRef} tabIndex={-1}>
        {title}
      </h2>
      {children}
      <div className="checkin-actions">
        {onBack ? (
          <button className="button secondary" type="button" onClick={onBack}>
            {backLabel}
          </button>
        ) : (
          <span />
        )}
        {onSkip ? (
          <button className="button quiet" type="button" onClick={onSkip}>
            Skip
          </button>
        ) : null}
      </div>
    </section>
  );
}
