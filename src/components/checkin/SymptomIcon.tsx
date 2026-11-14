export function SymptomIcon({ id }: { id: string }) {
  return (
    <svg className="symptom-mark" viewBox="0 0 48 48" aria-hidden="true">
      {iconPath(id)}
    </svg>
  );
}

function iconPath(id: string) {
  switch (id) {
    case "headache":
      return (
        <>
          <circle cx="24" cy="26" r="12" />
          <path d="M14 16c2-4 6-4 8 0s6 4 8 0" />
        </>
      );
    case "pain":
      return <path d="M24 8l4 12h10L28 28l4 12-8-8-8 8 4-12-10-8h10z" />;
    case "fatigue":
      return (
        <>
          <path d="M10 30c6-10 22-10 28 0" />
          <path d="M16 34h16" />
          <path d="M18 18v6M30 18v6" />
        </>
      );
    case "stomach":
      return <ellipse cx="24" cy="26" rx="12" ry="14" />;
    case "dizziness":
      return <path d="M24 10c8 0 12 6 8 10s-12 2-10 8 8 6 8 10" />;
    default:
      return <circle cx="24" cy="24" r="10" />;
  }
}
