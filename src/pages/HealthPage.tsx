import { useEffect } from "react";
import { SectionIntro } from "../components/SectionIntro";
import { useAppState } from "../state/AppStateProvider";

export function HealthPage() {
  const { state } = useAppState();

  useEffect(() => {
    document.title = "My Health · Healthcare UI Lab";
  }, []);

  return (
    <SectionIntro title="My Health">
      <p>
        {state.checkIns.length} sample check-ins are ready for simple mood, energy, stress,
        symptom, and medication charts.
      </p>
    </SectionIntro>
  );
}
