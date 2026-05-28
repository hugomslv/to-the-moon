"use client";

// Graphique d'activité : courbe du nombre de parties par jour (mock data)
// TODO : remplacer MOCK_ACTIVITY par un vrai appel /api/admin/activity?range=7d
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Génère des données simulées sur les 14 derniers jours
function generateMockActivity() {
  const data = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("fr-CH", { month: "short", day: "numeric" });
    data.push({
      jour: label,
      parties: Math.floor(Math.random() * 18) + 2,
      complétées: Math.floor(Math.random() * 14) + 1,
    });
  }
  return data;
}

const MOCK_ACTIVITY = generateMockActivity();

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs space-y-1"
      style={{
        background: "rgba(13,27,42,0.95)",
        border: "1px solid rgba(30,58,95,0.8)",
        backdropFilter: "blur(8px)",
      }}
    >
      <p className="font-semibold mb-1" style={{ color: "var(--space-text)" }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name} : <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

const ActivityChart: React.FC = () => {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--space-surface)",
        border: "1px solid var(--space-border)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm" style={{ color: "var(--space-text)" }}>
            📈 Activité (14 derniers jours)
          </h3>
          <p className="text-xs" style={{ color: "var(--space-muted)" }}>
            Données simulées — brancher sur /api/admin/activity
          </p>
        </div>
      </div>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MOCK_ACTIVITY} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.5)" />
            <XAxis
              dataKey="jour"
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(30,58,95,0.5)" }}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "#94a3b8", paddingTop: 8 }}
            />
            <Line
              type="monotone"
              dataKey="parties"
              stroke="#4cc9f0"
              strokeWidth={2}
              dot={{ fill: "#4cc9f0", r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="complétées"
              stroke="#06d6a0"
              strokeWidth={2}
              dot={{ fill: "#06d6a0", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;
