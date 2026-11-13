import { useEffect } from "react";
import { SectionIntro } from "../components/SectionIntro";
import { useAppState } from "../state/AppStateProvider";

export function CustomizePage() {
  const { state } = useAppState();

  useEffect(() => {
    document.title = "Customize tracking · Healthcare UI Lab";
  }, []);

  return (
    <SectionIntro title="Customize tracking">
      <p>
        The sample name is {state.preferences.displayName}. Symptom choices, custom questions, and
        suggestion preferences will be editable here.
      </p>
    </SectionIntro>
  );
}
