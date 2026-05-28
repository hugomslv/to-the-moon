"use client";

// Graphique barres : tentatives moyennes par énigme (données réelles via props)
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

interface PuzzleStat {
  puzzleId: string;
  _avg: { attempts: number | null };
  _count: { _all: number };
}

interface PuzzleStatsChartProps {
  data: PuzzleStat[];
}

const PUZZLE_NAMES: Record<string, string> = {
  morse: "Morse",
  binary: "Binaire",
  caesar: "César",
};

const COLORS = ["#4cc9f0", "#7c3aed", "#f8c843"];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs"
      style={{
        background: "rgba(13,27,42,0.95)",
        border: "1px solid rgba(30,58,95,0.8)",
        backdropFilter: "blur(8px)",
        color: "var(--space-text)",
      }}
    >
      <strong>{label}</strong>
      <p style={{ color: "#4cc9f0" }}>
        Moy. tentatives : <strong>{payload[0].value.toFixed(1)}</strong>
      </p>
    </div>
  );
};

const PuzzleStatsChart: React.FC<PuzzleStatsChartProps> = ({ data }) => {
  const chartData = data.map(p => ({
    name: PUZZLE_NAMES[p.puzzleId] ?? p.puzzleId,
    tentatives: p._avg.attempts ?? 0,
    joueurs: p._count._all,
  }));

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--space-surface)",
        border: "1px solid var(--space-border)",
      }}
    >
      <div className="mb-4">
        <h3 className="font-bold text-sm" style={{ color: "var(--space-text)" }}>
          🎯 Tentatives par énigme
        </h3>
        <p className="text-xs" style={{ color: "var(--space-muted)" }}>
          Moyenne de tentatives pour résoudre chaque énigme
        </p>
      </div>
      {chartData.length === 0 ? (
        <div className="h-40 flex items-center justify-center">
          <p className="text-sm" style={{ color: "var(--space-muted)" }}>Aucune donnée disponible</p>
        </div>
      ) : (
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.5)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(30,58,95,0.5)" }}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="tentatives" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PuzzleStatsChart;
