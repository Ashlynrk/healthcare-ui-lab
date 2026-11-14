import { useEffect } from "react";
import { CheckInFlow } from "../components/checkin/CheckInFlow";
import { greetingForHour, toISODate, todayDate } from "../lib/dates";
import { MOOD_OPTIONS } from "../lib/checkin";
import { useAppState } from "../state/AppStateProvider";

export function DailyLogPage() {
  const { state } = useAppState();
  const today = toISODate(todayDate());
  const previous = state.checkIns
    .filter((entry) => entry.date < today && entry.mood)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  const moodLabel = MOOD_OPTIONS.find((option) => option.id === previous?.mood)?.label.toLowerCase();
  const hour = new Date().getHours();

  useEffect(() => {
    document.title = "Today · Healthcare UI Lab";
  }, []);

  return (
    <>
      <section className="panel panel-hero panel-hero-compact" aria-labelledby="today-title">
        <div className="hero-shapes" aria-hidden="true">
          <span className="shape-arch" />
          <span className="shape-circle" />
          <span className="shape-block" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Today</p>
          <h1 id="today-title">
            {greetingForHour(hour)}, {state.preferences.displayName}
          </h1>
          <p className="lede">
            {moodLabel
              ? `Your last check-in felt ${moodLabel}. Today starts clean.`
              : "Today starts clean. Earlier sample days stay saved."}
          </p>
        </div>
      </section>
      <CheckInFlow />
    </>
  );
}
