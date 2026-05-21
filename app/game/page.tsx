"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadGameState } from "@/lib/storage";
import { PUZZLES } from "@/lib/puzzles";

export default function GamePage() {
  const router = useRouter();

  useEffect(() => {
    const state = loadGameState();
    if (!state) {
      router.replace("/");
      return;
    }
    const nextPuzzle = PUZZLES.find((p) => !state.completedPuzzles.includes(p.id));
    if (!nextPuzzle) {
      router.replace("/victory");
    } else {
      router.replace(`/game/${nextPuzzle.id}`);
    }
  }, [router]);

  return (
    <main className="min-h-svh flex items-center justify-center">
      <p style={{ color: "var(--space-muted)" }}>Chargement de la mission…</p>
    </main>
  );
}
