import { useEffect } from "react";
import { SectionIntro } from "../components/SectionIntro";
import { useAppState } from "../state/AppStateProvider";

export function RecordsPage() {
  const { state } = useAppState();
  const withResults = state.appointments.filter((visit) => visit.results).length;

  useEffect(() => {
    document.title = "My Records · Healthcare UI Lab";
  }, []);

  return (
    <SectionIntro title="My Records">
      <p>
        {withResults} fictional visit summaries are saved. They will be readable here, and they
        are not real medical documents.
      </p>
    </SectionIntro>
  );
}
