"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StarField from "@/components/StarField";
import RocketProgress from "@/components/RocketProgress";
import { formatTime } from "@/lib/utils";
import { GameState, loadGameState, saveGameState } from "@/lib/storage";
import { getPuzzleById, PUZZLES } from "@/lib/puzzles";
import { useTimer } from "@/hooks/useTimer";

interface Props {
  puzzleId: string;
}

export default function PuzzleView({ puzzleId }: Props) {
  const router = useRouter();
  const puzzle = getPuzzleById(puzzleId);

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hintsShown, setHintsShown] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  useEffect(() => {
    const state = loadGameState();
    if (!state) {
      router.replace("/");
      return;
    }
    setGameState(state);
    setAnswer("");
    setAttempts(0);
    setHintsShown(new Set());
    setFeedback(null);
  }, [puzzleId, router]);

  const elapsed = useTimer(gameState?.startedAt ?? null, feedback === "correct");

  if (!puzzle) {
    return (
      <main className="min-h-svh flex items-center justify-center">
        <p style={{ color: "var(--space-red)" }}>Énigme introuvable.</p>
      </main>
    );
  }

  if (!gameState) {
    return (
      <main className="min-h-svh flex items-center justify-center">
        <p style={{ color: "var(--space-muted)" }}>Chargement…</p>
      </main>
    );
  }

  const hintsUsedCount = gameState.hintsUsed[puzzleId] ?? 0;
  const completedCount = gameState.completedPuzzles.length;

  async function recordAttempt(solved: boolean) {
    if (!gameState) return;
    await fetch(`/api/sessions/${gameState.sessionId}/attempt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ puzzleId: puzzle!.id, solved, hintsUsed: hintsUsedCount }),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!gameState || !puzzle || feedback === "correct") return;

    const normalized = answer.trim().toLowerCase();
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (normalized === puzzle.answer.toLowerCase()) {
      setFeedback("correct");
      await recordAttempt(true);

      const completedPuzzles = [...gameState.completedPuzzles, puzzle.id];
      const nextPuzzle = PUZZLES.find((p) => p.order === puzzle.order + 1);
      const newState: GameState = { ...gameState, completedPuzzles, currentPuzzleIndex: puzzle.order };
      saveGameState(newState);
      setGameState(newState);

      setTimeout(async () => {
        if (nextPuzzle) {
          router.push(`/game/${nextPuzzle.id}`);
        } else {
          const totalTimeMs = Date.now() - gameState.startedAt + gameState.penaltyMs;
          await fetch(`/api/sessions/${gameState.sessionId}/complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ totalTimeMs }),
          });
          router.push("/victory");
        }
      }, 1200);
    } else {
      setFeedback("wrong");
      await recordAttempt(false);
      setTimeout(() => setFeedback(null), 700);
    }
  }

  function handleHint(index: number) {
    if (!gameState) return;
    const newCount = Math.max(hintsUsedCount, index + 1);
    const penaltyAdded = index === 1 && hintsUsedCount < 2 ? puzzle!.penaltySeconds * 1000 : 0;
    const newState: GameState = {
      ...gameState,
      hintsUsed: { ...gameState.hintsUsed, [puzzleId]: newCount },
      penaltyMs: gameState.penaltyMs + penaltyAdded,
    };
    saveGameState(newState);
    setGameState(newState);
    setHintsShown((prev) => new Set([...prev, index]));
  }

  const inputBorder =
    feedback === "correct"
      ? "var(--space-green)"
      : feedback === "wrong"
        ? "var(--space-red)"
        : "var(--space-border)";

  const totalElapsed = elapsed + gameState.penaltyMs;

  return (
    <main className="relative min-h-svh flex flex-col px-4 py-6">
      <StarField />

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-sm font-mono" style={{ color: "var(--space-accent)" }}>
            ⏱ {formatTime(totalElapsed)}
            {gameState.penaltyMs > 0 && (
              <span className="ml-1 text-xs" style={{ color: "var(--space-red)" }}>
                (+{formatTime(gameState.penaltyMs)})
              </span>
            )}
          </span>
          <span className="text-sm" style={{ color: "var(--space-muted)" }}>
            Énigme {puzzle.order}/{PUZZLES.length}
          </span>
        </div>

        <RocketProgress current={completedCount} total={PUZZLES.length} />

        <div
          className="px-4 py-3 rounded-xl text-sm italic"
          style={{
            background: "var(--space-surface)",
            borderLeft: "3px solid var(--space-accent)",
            color: "var(--space-muted)",
          }}
        >
          {puzzle.narrative}
        </div>

        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--space-gold)" }}>
            {puzzle.title}
          </h1>
          <pre
            className="mt-3 text-base whitespace-pre-wrap leading-relaxed"
            style={{ color: "var(--space-text)", fontFamily: "'Courier New', monospace" }}
          >
            {puzzle.question}
          </pre>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Ta réponse…"
            autoComplete="off"
            autoCapitalize="off"
            disabled={feedback === "correct"}
            className="w-full px-4 py-3 rounded-xl text-lg outline-none transition-colors"
            style={{
              background: "var(--space-surface)",
              border: `2px solid ${inputBorder}`,
              color: "var(--space-text)",
            }}
          />

          {feedback === "wrong" && (
            <p className="text-sm" style={{ color: "var(--space-red)" }}>
              Mauvaise réponse – {attempts} tentative{attempts > 1 ? "s" : ""}
            </p>
          )}
          {feedback === "correct" && (
            <p className="text-sm font-bold" style={{ color: "var(--space-green)" }}>
              ✓ Correct ! Passage à la suite…
            </p>
          )}

          <button
            type="submit"
            disabled={feedback === "correct" || !answer.trim()}
            className="w-full py-3 rounded-xl font-bold transition-opacity disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, var(--space-accent), var(--space-green))",
              color: "#050a18",
            }}
          >
            Valider
          </button>
        </form>

        <div className="space-y-2">
          {puzzle.hints.map((hint, i) => {
            if (hintsShown.has(i)) {
              return (
                <div
                  key={i}
                  className="px-4 py-3 rounded-xl text-sm"
                  style={{
                    background: "var(--space-surface)",
                    border: "1px solid var(--space-gold)",
                    color: "var(--space-text)",
                  }}
                >
                  💡 {hint}
                  {i === 1 && (
                    <span className="ml-1 text-xs" style={{ color: "var(--space-red)" }}>
                      (+{puzzle.penaltySeconds}s appliqués)
                    </span>
                  )}
                </div>
              );
            }
            if (i > 0 && hintsUsedCount < 1) return null;
            return (
              <button
                key={i}
                onClick={() => handleHint(i)}
                className="w-full px-4 py-2 rounded-xl text-sm text-left"
                style={{
                  background: "var(--space-surface)",
                  border: "1px dashed var(--space-border)",
                  color: "var(--space-muted)",
                }}
              >
                {i === 0
                  ? "💡 Voir l'indice gratuit"
                  : `⚠️ Indice 2 (pénalité : +${puzzle.penaltySeconds}s)`}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
