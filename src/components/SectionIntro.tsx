import { useId, type ReactNode } from "react";

export function SectionIntro({
  eyebrow = "Sample profile",
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  const titleId = useId();

  return (
    <section className="panel" aria-labelledby={titleId}>
      <p className="eyebrow">{eyebrow}</p>
      <h1 id={titleId}>{title}</h1>
      <div className="lede">{children}</div>
    </section>
  );
}
