"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StarField from "@/components/StarField";
import { GameState, clearGameState, loadGameState } from "@/lib/storage";
import { formatTime } from "@/lib/utils";

export default function VictoryPage() {
  const [state, setState] = useState<GameState | null>(null);
  const [rating, setRating] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const s = loadGameState();
    if (!s) {
      router.replace("/");
      return;
    }
    setState(s);
  }, [router]);

  async function handleSurvey(e: React.FormEvent) {
    e.preventDefault();
    if (!state || rating === 0 || difficulty === 0) return;
    setLoading(true);

    await fetch(`/api/sessions/${state.sessionId}/survey`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, difficulty, comment }),
    });

    clearGameState();
    setSubmitted(true);
    setLoading(false);
  }

  const totalMs = state ? Date.now() - state.startedAt + state.penaltyMs : 0;

  if (!state) return null;

  return (
    <main className="relative min-h-svh flex flex-col items-center justify-center px-6">
      <StarField />
      <div className="relative z-10 w-full max-w-sm text-center space-y-8">
        {!submitted ? (
          <>
            <div>
              <p className="text-6xl select-none" aria-hidden="true">🏆</p>
              <h1 className="text-3xl font-bold mt-2" style={{ color: "var(--space-gold)" }}>
                Mission accomplie !
              </h1>
              <p className="mt-1 text-xl font-mono" style={{ color: "var(--space-accent)" }}>
                {formatTime(totalMs)}
              </p>
              {state.penaltyMs > 0 && (
                <p className="text-sm mt-1" style={{ color: "var(--space-muted)" }}>
                  dont {formatTime(state.penaltyMs)} de pénalités
                </p>
              )}
              <p className="mt-1 text-sm" style={{ color: "var(--space-muted)" }}>
                Équipe : {state.teamName}
              </p>
            </div>

            <form onSubmit={handleSurvey} className="space-y-6 text-left">
              <fieldset>
                <legend className="font-semibold mb-3 text-center">
                  Tu as aimé ? (1–5)
                </legend>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className="text-3xl transition-transform active:scale-90"
                      style={{ opacity: rating >= n ? 1 : 0.3 }}
                      aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="font-semibold mb-3 text-center">
                  C&apos;était difficile ? (1–5)
                </legend>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setDifficulty(n)}
                      className="text-3xl transition-transform active:scale-90"
                      style={{ opacity: difficulty >= n ? 1 : 0.3 }}
                      aria-label={`Difficulté ${n}`}
                    >
                      🔥
                    </button>
                  ))}
                </div>
              </fieldset>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Un commentaire ? (facultatif)"
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 rounded-xl resize-none outline-none"
                style={{
                  background: "var(--space-surface)",
                  border: "2px solid var(--space-border)",
                  color: "var(--space-text)",
                }}
              />

              <button
                type="submit"
                disabled={rating === 0 || difficulty === 0 || loading}
                className="w-full py-3 rounded-xl font-bold transition-opacity disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, var(--space-accent), var(--space-green))",
                  color: "#050a18",
                }}
              >
                {loading ? "Envoi…" : "Envoyer le rapport de mission"}
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-6">
            <p className="text-6xl select-none" aria-hidden="true">🌟</p>
            <h2 className="text-2xl font-bold" style={{ color: "var(--space-gold)" }}>
              Merci pour ton retour !
            </h2>
            <p style={{ color: "var(--space-muted)" }}>
              Ton score a été enregistré dans le classement.
            </p>
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 rounded-xl font-bold"
              style={{
                background: "var(--space-surface)",
                border: "1px solid var(--space-accent)",
                color: "var(--space-accent)",
              }}
            >
              Nouvelle mission
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
