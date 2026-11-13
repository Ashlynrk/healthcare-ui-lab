import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import { useAppState } from "../state/AppStateProvider";

const LINKS = [
  { to: "/", label: "Today", end: true },
  { to: "/appointments", label: "My Appointments", end: false },
  { to: "/journal", label: "My Journal", end: false },
  { to: "/health", label: "My Health", end: false },
  { to: "/records", label: "My Records", end: false },
  { to: "/notes", label: "My Notes", end: false },
  { to: "/customize", label: "Customize tracking", end: false },
];

export function Menu() {
  const { reset } = useAppState();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function closeMenu() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  function resetSample() {
    const confirmed = window.confirm(
      "Reset the sample profile in this browser? Practice entries on this device will be replaced with the original sample.",
    );
    if (!confirmed) return;
    reset();
    setMessage("Sample profile reset.");
  }

  return (
    <div className="menu">
      <button
        ref={buttonRef}
        className="menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="app-menu"
        onClick={() => setOpen((current) => !current)}
      >
        Menu
      </button>
      {open ? (
        <>
          <button
            className="menu-backdrop"
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <nav ref={panelRef} id="app-menu" className="menu-panel" aria-label="Sections">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? "menu-link is-active" : "menu-link")}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <hr className="menu-divider" />
            <button className="reset-button" type="button" onClick={resetSample}>
              Reset sample data
            </button>
            <p className="live-message" role="status">
              {message}
            </p>
          </nav>
        </>
      ) : null}
    </div>
  );
}
