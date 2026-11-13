import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { freshState, loadState, saveState } from "../data/storage";
import type { AppState } from "../types/models";

type AppStateContextValue = {
  state: AppState;
  update: (recipe: (current: AppState) => AppState) => void;
  reset: () => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());

  const update = useCallback((recipe: (current: AppState) => AppState) => {
    setState((current) => {
      const next = recipe(current);
      saveState(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setState(freshState());
  }, []);

  return (
    <AppStateContext.Provider value={{ state, update, reset }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppStateContextValue {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return value;
}
