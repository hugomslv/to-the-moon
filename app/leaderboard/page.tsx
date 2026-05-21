import { db } from "@/lib/db";
import StarField from "@/components/StarField";
import { formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const sessions = await db.session.findMany({
    where: { completed: true, totalTimeMs: { not: null } },
    orderBy: { totalTimeMs: "asc" },
    take: 20,
    select: { id: true, teamName: true, totalTimeMs: true },
  });

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <main className="relative min-h-svh px-6 py-12">
      <StarField />
      <div className="relative z-10 max-w-lg mx-auto">
        <h1
          className="text-3xl font-bold text-center mb-8"
          style={{ color: "var(--space-gold)" }}
        >
          🏆 Classement
        </h1>

        {sessions.length === 0 ? (
          <p className="text-center" style={{ color: "var(--space-muted)" }}>
            Aucune mission terminée pour l&apos;instant.
          </p>
        ) : (
          <ol className="space-y-3">
            {sessions.map((s, i) => (
              <li
                key={s.id}
                className="flex items-center justify-between px-4 py-4 rounded-xl"
                style={{
                  background: "var(--space-surface)",
                  border: "1px solid var(--space-border)",
                }}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center select-none" aria-hidden="true">
                    {medals[i] ?? `${i + 1}.`}
                  </span>
                  <span className="font-semibold">{s.teamName}</span>
                </span>
                <span
                  className="font-mono font-bold"
                  style={{
                    color: i === 0 ? "var(--space-gold)" : "var(--space-accent)",
                  }}
                >
                  {formatTime(s.totalTimeMs!)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}
