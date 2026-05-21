interface RocketProgressProps {
  current: number;
  total: number;
}

export default function RocketProgress({ current, total }: RocketProgressProps) {
  const percent = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`${current} sur ${total} énigmes résolues`}
    >
      <div
        className="relative h-5 rounded-full overflow-visible"
        style={{ background: "var(--space-surface)", border: "1px solid var(--space-border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg, var(--space-accent), var(--space-green))",
          }}
        />
        <span
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-lg leading-none transition-all duration-700 select-none"
          style={{ left: `${Math.max(percent, 3)}%` }}
          aria-hidden="true"
        >
          🚀
        </span>
      </div>
      <p className="text-xs mt-1" style={{ color: "var(--space-muted)" }}>
        {current}/{total} énigmes résolues
      </p>
    </div>
  );
}
