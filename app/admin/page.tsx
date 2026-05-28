"use client";

// Dashboard admin – données réelles depuis les API + recharts
// TODO : brancher sur un vrai backend en remplaçant les URL fetch par votre service API
import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import StatCard from "@/components/admin/StatCard";
import MiniLeaderboard from "@/components/admin/MiniLeaderboard";
import AdminResetButton from "@/components/AdminResetButton";
import { formatTime } from "@/lib/utils";

// Recharts chargé côté client (composants SVG non compatibles SSR)
const ActivityChart = dynamic(() => import("@/components/admin/charts/ActivityChart"), { ssr: false });
const PuzzleStatsChart = dynamic(() => import("@/components/admin/charts/PuzzleStatsChart"), { ssr: false });
const SatisfactionChart = dynamic(() => import("@/components/admin/charts/SatisfactionChart"), { ssr: false });

// ── Types ──────────────────────────────────────────────────────────────────

interface StatsData {
  total: number;
  completed: number;
  avgTimeMs: number;
  puzzleStats: { puzzleId: string; _avg: { attempts: number | null }; _count: { _all: number } }[];
  avgRating: number;
  avgDifficulty: number;
}

interface LeaderEntry {
  id: string;
  teamName: string;
  totalTimeMs: number | null;
  finishedAt: string | null;
}

interface Session {
  id: string;
  teamName: string;
  startedAt: string;
  finishedAt: string | null;
  totalTimeMs: number | null;
  completed: boolean;
  attempts: { puzzleId: string; attempts: number; hintsUsed: number }[];
}

// ── Composant tableau de sessions ─────────────────────────────────────────

const SessionsTable: React.FC<{
  sessions: Session[];
  total: number;
  page: number;
  loading: boolean;
  search: string;
  onSearch: (v: string) => void;
  onPageChange: (p: number) => void;
  onSort: (col: string) => void;
  sortBy: string;
  order: string;
}> = ({ sessions, total, page, loading, search, onSearch, onPageChange, onSort, sortBy, order }) => {
  const LIMIT = 10;
  const totalPages = Math.ceil(total / LIMIT);
  const sortIcon = (col: string) =>
    sortBy === col ? (order === "asc" ? " ▲" : " ▼") : " ·";

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--space-surface)", border: "1px solid var(--space-border)" }}
    >
      {/* En-tête table */}
      <div className="flex items-center justify-between px-5 py-4 gap-4" style={{ borderBottom: "1px solid var(--space-border)" }}>
        <h3 className="font-bold text-sm" style={{ color: "var(--space-text)" }}>
          🎮 Sessions ({total})
        </h3>
        <input
          type="search"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Rechercher un pseudo…"
          className="px-3 py-1.5 rounded-xl text-xs outline-none w-48"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--space-border)",
            color: "var(--space-text)",
          }}
          onFocus={e => (e.target.style.borderColor = "var(--space-accent)")}
          onBlur={e => (e.target.style.borderColor = "var(--space-border)")}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--space-border)" }}>
              {[
                ["teamName", "Équipe"],
                ["startedAt", "Début"],
                ["totalTimeMs", "Temps"],
              ].map(([col, label]) => (
                <th
                  key={col}
                  onClick={() => onSort(col)}
                  className="px-5 py-3 text-left text-xs font-semibold cursor-pointer select-none uppercase tracking-wider transition-colors"
                  style={{ color: sortBy === col ? "var(--space-accent)" : "var(--space-muted)" }}
                  onMouseEnter={e => ((e.target as HTMLTableCellElement).style.color = "var(--space-text)")}
                  onMouseLeave={e => ((e.target as HTMLTableCellElement).style.color = sortBy === col ? "var(--space-accent)" : "var(--space-muted)")}
                >
                  {label}{sortIcon(col)}
                </th>
              ))}
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--space-muted)" }}>
                Statut
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--space-muted)" }}>
                Indices
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <div className="inline-block w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                </td>
              </tr>
            ) : sessions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-sm" style={{ color: "var(--space-muted)" }}>
                  Aucune session trouvée
                </td>
              </tr>
            ) : (
              sessions.map((s, i) => {
                const totalHints = s.attempts.reduce((acc, a) => acc + a.hintsUsed, 0);
                return (
                  <tr
                    key={s.id}
                    style={{
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                      borderBottom: "1px solid rgba(30,58,95,0.3)",
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLTableRowElement).style.background = "rgba(76,201,240,0.05)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)")}
                  >
                    <td className="px-5 py-3 font-medium" style={{ color: "var(--space-text)" }}>
                      {s.teamName}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs" style={{ color: "var(--space-muted)" }}>
                      {new Date(s.startedAt).toLocaleString("fr-CH", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs" style={{ color: "var(--space-accent)" }}>
                      {s.totalTimeMs ? formatTime(s.totalTimeMs) : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background: s.completed ? "rgba(6,214,160,0.15)" : "rgba(248,200,67,0.12)",
                          color: s.completed ? "var(--space-green)" : "var(--space-gold)",
                          border: `1px solid ${s.completed ? "rgba(6,214,160,0.3)" : "rgba(248,200,67,0.25)"}`,
                        }}
                      >
                        {s.completed ? "✓ Terminée" : "⏳ En cours"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs font-mono" style={{ color: totalHints > 0 ? "var(--space-gold)" : "var(--space-muted)" }}>
                      {totalHints > 0 ? `⚡ ${totalHints}` : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 gap-3" style={{ borderTop: "1px solid var(--space-border)" }}>
          <p className="text-xs" style={{ color: "var(--space-muted)" }}>
            Page {page} / {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", color: "var(--space-text)", border: "1px solid var(--space-border)" }}
            >
              ← Préc.
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", color: "var(--space-text)", border: "1px solid var(--space-border)" }}
            >
              Suiv. →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Page principale ────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsTotal, setSessionsTotal] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("startedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  // Chargement des stats et du leaderboard
  useEffect(() => {
    setLoadingStats(true);
    Promise.all([
      fetch("/api/admin/stats").then(r => r.json()),
      fetch("/api/leaderboard").then(r => r.json()),
    ]).then(([s, l]) => {
      setStats(s as StatsData);
      setLeaderboard(l as LeaderEntry[]);
      setLoadingStats(false);
    }).catch(() => setLoadingStats(false));
  }, []);

  // Chargement des sessions (avec filtres/tri/pagination)
  const fetchSessions = useCallback(() => {
    setLoadingSessions(true);
    const params = new URLSearchParams({
      page: String(page),
      search,
      sortBy,
      order,
      limit: "10",
    });
    fetch(`/api/admin/sessions?${params}`)
      .then(r => r.json())
      .then(data => {
        setSessions((data as { sessions: Session[] }).sessions);
        setSessionsTotal((data as { total: number }).total);
        setLoadingSessions(false);
      })
      .catch(() => setLoadingSessions(false));
  }, [page, search, sortBy, order]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  // Gestion du tri
  const handleSort = (col: string) => {
    if (sortBy === col) setOrder(o => (o === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setOrder("desc"); }
    setPage(1);
  };

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  const completionRate = stats && stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Titre */}
      <div>
        <h2 className="text-xl font-bold" style={{ color: "var(--space-text)" }}>
          Tableau de bord
        </h2>
        <p className="text-sm" style={{ color: "var(--space-muted)" }}>
          Vue d&apos;ensemble du CTF en temps réel
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="🎮"
          label="Parties lancées"
          value={stats?.total ?? 0}
          trend={8}
          description="Depuis le début"
          color="var(--space-accent)"
          duration={2}
        />
        <StatCard
          icon="✅"
          label="Complétées"
          value={stats?.completed ?? 0}
          suffix=""
          trend={completionRate}
          description={`${completionRate}% de taux`}
          color="var(--space-green)"
          duration={2}
        />
        <StatCard
          icon="⏱"
          label="Temps moyen"
          value={stats ? Math.round((stats.avgTimeMs ?? 0) / 1000) : 0}
          suffix="s"
          description={stats?.avgTimeMs ? formatTime(stats.avgTimeMs) : "—"}
          color="var(--space-gold)"
          duration={1.5}
        />
        <StatCard
          icon="⭐"
          label="Satisfaction"
          value={Number((stats?.avgRating ?? 0).toFixed(1))}
          suffix="/5"
          description="Note moyenne"
          color="#7c3aed"
          duration={2}
        />
      </div>

      {/* Graphiques ligne 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityChart />
        <PuzzleStatsChart data={stats?.puzzleStats ?? []} />
      </div>

      {/* Leaderboard + Satisfaction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MiniLeaderboard entries={leaderboard} loading={loadingStats} />
        <SatisfactionChart
          avgRating={stats?.avgRating ?? 0}
          avgDifficulty={stats?.avgDifficulty ?? 0}
        />
      </div>

      {/* Tableau des sessions */}
      <SessionsTable
        sessions={sessions}
        total={sessionsTotal}
        page={page}
        loading={loadingSessions}
        search={search}
        onSearch={handleSearch}
        onPageChange={setPage}
        onSort={handleSort}
        sortBy={sortBy}
        order={order}
      />

      {/* Zone de danger : reset */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "rgba(239,35,60,0.05)",
          border: "1px solid rgba(239,35,60,0.2)",
        }}
      >
        <h3 className="font-bold text-sm mb-1" style={{ color: "var(--space-red)" }}>
          ⚠ Zone de danger
        </h3>
        <p className="text-xs mb-4" style={{ color: "var(--space-muted)" }}>
          Cette action supprime toutes les sessions, tentatives et résultats. Irréversible.
        </p>
        <div className="max-w-xs">
          <AdminResetButton />
        </div>
      </div>
    </div>
  );
}
