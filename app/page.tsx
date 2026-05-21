"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StarField from "@/components/StarField";
import { saveGameState } from "@/lib/storage";
import { PUZZLES } from "@/lib/puzzles";

export default function LandingPage() {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    const name = teamName.trim();
    if (!name) {
      setError("Entre un pseudo ou un nom d'équipe pour décoller !");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName: name }),
      });

      if (!res.ok) throw new Error("Erreur serveur");
      const { sessionId } = (await res.json()) as { sessionId: string };

      saveGameState({
        sessionId,
        teamName: name,
        startedAt: Date.now(),
        currentPuzzleIndex: 0,
        completedPuzzles: [],
        hintsUsed: {},
        penaltyMs: 0,
      });

      router.push(`/game/${PUZZLES[0].id}`);
    } catch {
      setError("Impossible de démarrer la mission. Réessaie.");
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-svh flex flex-col items-center justify-center px-6">
      <StarField />

      <div className="relative z-10 w-full max-w-sm text-center space-y-8">
        <div className="space-y-2">
          <p className="text-6xl select-none" aria-hidden="true">🚀</p>
          <h1
            className="text-4xl font-bold tracking-tight"
            style={{ color: "var(--space-gold)" }}
          >
            To The Moon
          </h1>
          <p style={{ color: "var(--space-muted)" }}>Mission CTF – ICT-306</p>
        </div>

        <p style={{ color: "var(--space-text)" }}>
          Trois énigmes spatiales t&apos;attendent.
          <br />
          Résous-les toutes pour achever la mission !
        </p>

        <form onSubmit={handleStart} className="space-y-4">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Pseudo ou nom d'équipe"
            maxLength={32}
            autoFocus
            className="w-full px-4 py-3 rounded-xl text-lg text-center outline-none"
            style={{
              background: "var(--space-surface)",
              border: "2px solid var(--space-border)",
              color: "var(--space-text)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--space-accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--space-border)")}
          />

          {error && (
            <p className="text-sm" style={{ color: "var(--space-red)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-lg font-bold transition-opacity disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, var(--space-accent), var(--space-green))",
              color: "#050a18",
            }}
          >
            {loading ? "Décollage…" : "Décoller 🚀"}
          </button>
        </form>
      </div>
    </main>
  );
}
