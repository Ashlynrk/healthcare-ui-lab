import { useEffect } from "react";
import { SectionIntro } from "../components/SectionIntro";
import { useAppState } from "../state/AppStateProvider";

export function AppointmentsPage() {
  const { state } = useAppState();

  useEffect(() => {
    document.title = "My Appointments · Healthcare UI Lab";
  }, []);

  return (
    <SectionIntro title="My Appointments">
      <p>
        {state.appointments.length} sample visits are saved, including past and upcoming ones.
        The visit list, notes, results, and questions will open here.
      </p>
    </SectionIntro>
  );
}
