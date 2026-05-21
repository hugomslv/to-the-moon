"use client";

import { useCallback, useEffect, useState } from "react";
import { GameState, clearGameState, loadGameState, saveGameState } from "@/lib/storage";

export function useGameProgress() {
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    setState(loadGameState());
  }, []);

  const update = useCallback((patch: Partial<GameState>) => {
    setState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      saveGameState(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    clearGameState();
    setState(null);
  }, []);

  return { state, update, clear };
}
