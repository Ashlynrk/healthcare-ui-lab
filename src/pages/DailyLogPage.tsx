import { useEffect } from "react";
import { toISODate, todayDate } from "../lib/dates";
import { useAppState } from "../state/AppStateProvider";

export function DailyLogPage() {
  const { state } = useAppState();
  const today = toISODate(todayDate());
  const startedToday = state.checkIns.some((entry) => entry.date === today);

  useEffect(() => {
    document.title = "Today · Healthcare UI Lab";
  }, []);

  const saved = [
    { label: "Earlier check-ins", value: state.checkIns.length },
    { label: "Medications", value: state.medications.length },
    { label: "Visits", value: state.appointments.length },
    { label: "Journal entries", value: state.journal.length },
    { label: "Notes", value: state.notes.length },
  ];

  return (
    <>
      <section className="panel panel-hero" aria-labelledby="today-title">
        <div className="hero-shapes" aria-hidden="true">
          <span className="shape-arch" />
          <span className="shape-circle" />
          <span className="shape-block" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Today</p>
          <h1 id="today-title">Your day starts here</h1>
          <p className="lede">
            {startedToday
              ? "Today’s check-in is already saved in this browser."
              : "Today’s check-in has not been started. Earlier sample days are already saved."}
          </p>
          <p className="meta">The daily check-in, encouragement, and medication list will open on this page.</p>
        </div>
      </section>
      <section aria-labelledby="saved-title">
        <h2 id="saved-title">Saved with this sample profile</h2>
        <ul className="stat-list">
          {saved.map((item) => (
            <li key={item.label} className="stat-card">
              <span className="stat-value">{item.value}</span>
              <span className="stat-label">{item.label}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
