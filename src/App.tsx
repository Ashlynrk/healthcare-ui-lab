import { BrowserRouter, Route, Routes } from "react-router";
import { AppShell } from "./components/AppShell";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { CustomizePage } from "./pages/CustomizePage";
import { DailyLogPage } from "./pages/DailyLogPage";
import { HealthPage } from "./pages/HealthPage";
import { JournalPage } from "./pages/JournalPage";
import { NotesPage } from "./pages/NotesPage";
import { RecordsPage } from "./pages/RecordsPage";
import { AppStateProvider } from "./state/AppStateProvider";

export function App() {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<DailyLogPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/health" element={<HealthPage />} />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/customize" element={<CustomizePage />} />
          </Routes>
        </AppShell>
      </AppStateProvider>
    </BrowserRouter>
  );
}
