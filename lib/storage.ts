const STORAGE_KEY = "ttm_game_state";

export interface GameState {
  sessionId: string;
  teamName: string;
  startedAt: number;
  currentPuzzleIndex: number;
  completedPuzzles: string[];
  hintsUsed: Record<string, number>;
  penaltyMs: number;
}

export function loadGameState(): GameState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearGameState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
