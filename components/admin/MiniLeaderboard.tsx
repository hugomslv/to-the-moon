"use client";

// Mini-leaderboard intégré au dashboard
import React from "react";
import { formatTime } from "@/lib/utils";

interface LeaderEntry {
  id: string;
  teamName: string;
  totalTimeMs: number | null;
}

interface MiniLeaderboardProps {
  entries: LeaderEntry[];
  loading?: boolean;
}

const MEDALS = ["🥇", "🥈", "🥉"];

const MiniLeaderboard: React.FC<MiniLeaderboardProps> = ({ entries, loading }) => {
  return (
    <div
      className="rounded-2xl p-5 h-full flex flex-col gap-4"
      style={{
        background: "var(--space-surface)",
        border: "1px solid var(--space-border)",
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm" style={{ color: "var(--space-text)" }}>
          🏆 Top joueurs
        </h3>
        <a href="/leaderboard" className="text-xs transition-colors" style={{ color: "var(--space-accent)" }}>
          Voir tout →
        </a>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <p className="text-sm text-center py-4" style={{ color: "var(--space-muted)" }}>
          Aucune partie terminée
        </p>
      ) : (
        <ul className="space-y-2">
          {entries.slice(0, 5).map((entry, i) => (
            <li
              key={entry.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={{
                background: i < 3 ? "rgba(76,201,240,0.05)" : "rgba(255,255,255,0.02)",
                border: i < 3 ? "1px solid rgba(76,201,240,0.12)" : "1px solid transparent",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLLIElement).style.background = "rgba(76,201,240,0.08)")}
              onMouseLeave={e => ((e.currentTarget as HTMLLIElement).style.background = i < 3 ? "rgba(76,201,240,0.05)" : "rgba(255,255,255,0.02)")}
            >
              <span className="text-base w-6 text-center flex-shrink-0">
                {MEDALS[i] ?? `#${i + 1}`}
              </span>
              <span className="flex-1 font-medium truncate" style={{ color: "var(--space-text)" }}>
                {entry.teamName}
              </span>
              <span className="font-mono text-xs flex-shrink-0" style={{ color: "var(--space-accent)" }}>
                {entry.totalTimeMs ? formatTime(entry.totalTimeMs) : "—"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MiniLeaderboard;
