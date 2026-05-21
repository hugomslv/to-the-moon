import { db } from "@/lib/db";
import StarField from "@/components/StarField";
import AdminResetButton from "@/components/AdminResetButton";
import { formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [total, completed, avgTimeResult, puzzleStats] = await Promise.all([
    db.session.count(),
    db.session.count({ where: { completed: true } }),
    db.session.aggregate({
      where: { completed: true },
      _avg: { totalTimeMs: true },
    }),
    db.puzzleAttempt.groupBy({
      by: ["puzzleId"],
      _avg: { attempts: true },
      _count: { _all: true },
      orderBy: { _avg: { attempts: "desc" } },
    }),
  ]);

  const avgMs = Math.round(avgTimeResult._avg.totalTimeMs ?? 0);
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: "Parties lancées", value: String(total) },
    { label: "Parties terminées", value: String(completed) },
    { label: "Temps moyen", value: avgMs > 0 ? formatTime(avgMs) : "—" },
    { label: "Taux de complétion", value: total > 0 ? `${completionRate} %` : "—" },
  ];

  return (
    <main className="relative min-h-svh px-6 py-12">
      <StarField />
      <div className="relative z-10 max-w-lg mx-auto space-y-8">
        <h1
          className="text-3xl font-bold text-center"
          style={{ color: "var(--space-gold)" }}
        >
          ⚙️ Administration
        </h1>

        <div className="grid grid-cols-2 gap-4">
          {stats.map(({ label, value }) => (
            <div
              key={label}
              className="px-4 py-5 rounded-xl text-center"
              style={{
                background: "var(--space-surface)",
                border: "1px solid var(--space-border)",
              }}
            >
              <p className="text-2xl font-bold" style={{ color: "var(--space-accent)" }}>
                {value}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--space-muted)" }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {puzzleStats.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">
              Tentatives moyennes par énigme
            </h2>
            <ul className="space-y-2">
              {puzzleStats.map((p) => (
                <li
                  key={p.puzzleId}
                  className="flex justify-between px-4 py-3 rounded-xl text-sm"
                  style={{
                    background: "var(--space-surface)",
                    border: "1px solid var(--space-border)",
                  }}
                >
                  <span style={{ color: "var(--space-text)" }}>{p.puzzleId}</span>
                  <span style={{ color: "var(--space-accent)" }}>
                    {(p._avg.attempts ?? 0).toFixed(1)} tentatives
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4">
          <AdminResetButton />
        </div>
      </div>
    </main>
  );
}
