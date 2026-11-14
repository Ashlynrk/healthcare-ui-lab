const MOUTHS: Record<string, string> = {
  low: "M17 41c3-7 11-7 14 0",
  uneasy: "M18 39c2-4 8-4 12 0",
  steady: "M17 38h14",
  good: "M16 36c4 6 12 6 16 0",
  bright: "M15 33c5 11 15 11 18 0",
  "sleep-1": "M17 41c3-7 11-7 14 0",
  "sleep-2": "M18 39c2-4 8-4 12 0",
  "sleep-3": "M17 38h14",
  "sleep-4": "M16 36c4 6 12 6 16 0",
  "sleep-5": "M15 33c5 11 15 11 18 0",
};

export function FaceMark({ expression }: { expression: keyof typeof MOUTHS }) {
  const eyesClosed = expression.startsWith("sleep");
  return (
    <svg className="face-mark" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="15" />
      {eyesClosed ? (
        <>
          <path d="M16 22h6" />
          <path d="M26 22h6" />
        </>
      ) : (
        <>
          <circle cx="18" cy="22" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="30" cy="22" r="1.2" fill="currentColor" stroke="none" />
        </>
      )}
      <path d={MOUTHS[expression]} />
    </svg>
  );
}
