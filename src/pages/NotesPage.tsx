import { useEffect } from "react";
import { SectionIntro } from "../components/SectionIntro";
import { useAppState } from "../state/AppStateProvider";

export function NotesPage() {
  const { state } = useAppState();

  useEffect(() => {
    document.title = "My Notes · Healthcare UI Lab";
  }, []);

  return (
    <SectionIntro title="My Notes">
      <p>
        {state.notes.length} sample reminders are saved. This list stays separate from the journal
        and from questions for a visit.
      </p>
    </SectionIntro>
  );
}
