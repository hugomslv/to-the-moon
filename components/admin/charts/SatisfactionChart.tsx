"use client";

// Graphique donut : répartition des notes de satisfaction
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface SatisfactionChartProps {
  avgRating: number;
  avgDifficulty: number;
}

const SatisfactionChart: React.FC<SatisfactionChartProps> = ({ avgRating, avgDifficulty }) => {
  // Représente la satisfaction comme un gauge via un demi-donut
  const score = Math.max(0, Math.min(5, avgRating));
  const empty = 5 - score;
  const data = [
    { name: "Note", value: score },
    { name: "Reste", value: empty },
  ];

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: "var(--space-surface)",
        border: "1px solid var(--space-border)",
      }}
    >
      <div>
        <h3 className="font-bold text-sm" style={{ color: "var(--space-text)" }}>
          ⭐ Satisfaction joueurs
        </h3>
        <p className="text-xs" style={{ color: "var(--space-muted)" }}>
          Moyenne des questionnaires de fin de partie
        </p>
      </div>

      {score === 0 ? (
        <div className="flex-1 flex items-center justify-center py-6">
          <p className="text-sm" style={{ color: "var(--space-muted)" }}>
            Aucun questionnaire rempli
          </p>
        </div>
      ) : (
        <>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="80%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={55}
                  outerRadius={75}
                  dataKey="value"
                  strokeWidth={0}
                >
                  <Cell fill="#06d6a0" />
                  <Cell fill="rgba(30,58,95,0.4)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Métriques textuelles */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold font-mono" style={{ color: "var(--space-green)" }}>
                {score.toFixed(1)}/5
              </p>
              <p className="text-xs" style={{ color: "var(--space-muted)" }}>Satisfaction</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono" style={{ color: "var(--space-gold)" }}>
                {avgDifficulty.toFixed(1)}/5
              </p>
              <p className="text-xs" style={{ color: "var(--space-muted)" }}>Difficulté perçue</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SatisfactionChart;
