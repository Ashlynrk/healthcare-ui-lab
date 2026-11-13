import { useEffect } from "react";
import { SectionIntro } from "../components/SectionIntro";
import { useAppState } from "../state/AppStateProvider";

export function JournalPage() {
  const { state } = useAppState();

  useEffect(() => {
    document.title = "My Journal · Healthcare UI Lab";
  }, []);

  return (
    <SectionIntro title="My Journal">
      <p>
        {state.journal.length} sample journal entries are saved. Longer personal writing will
        open here, separate from the short check-in note.
      </p>
    </SectionIntro>
  );
}
