import type { ReactNode } from "react";
import { formatLongDate, todayDate } from "../lib/dates";
import { useAppState } from "../state/AppStateProvider";
import { Menu } from "./Menu";
import { PrivacyBanner } from "./PrivacyBanner";

export function AppShell({ children }: { children: ReactNode }) {
  const { state } = useAppState();

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <p className="product-name">Healthcare UI Lab</p>
          <p className="who">
            <span>{state.preferences.displayName}</span>
            <span className="badge">{state.profileLabel}</span>
          </p>
          <p className="date-line">{formatLongDate(todayDate())}</p>
        </div>
        <Menu />
      </header>
      <PrivacyBanner />
      <main className="page">{children}</main>
    </div>
  );
}
