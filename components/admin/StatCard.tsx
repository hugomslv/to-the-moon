"use client";

// Carte KPI avec SpotlightCard (ReactBits) et CountUp animé
import React from "react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import CountUp from "@/components/ui/CountUp";

export interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  suffix?: string;
  trend?: number;       // % d'évolution (positif = hausse, négatif = baisse)
  description?: string;
  color?: string;
  duration?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  suffix = "",
  trend,
  description,
  color = "var(--space-accent)",
  duration = 2,
}) => {
  const trendPositive = trend !== undefined && trend >= 0;

  return (
    <SpotlightCard
      className="rounded-2xl h-full"
      spotlightColor={`${color}18`}
    >
      <div
        className="rounded-2xl p-5 h-full flex flex-col gap-3"
        style={{
          background: "var(--space-surface)",
          border: "1px solid var(--space-border)",
        }}
      >
        {/* En-tête */}
        <div className="flex items-start justify-between">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: `${color}18`, border: `1px solid ${color}30` }}
          >
            {icon}
          </div>
          {trend !== undefined && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{
                background: trendPositive ? "rgba(6,214,160,0.12)" : "rgba(239,35,60,0.12)",
                color: trendPositive ? "var(--space-green)" : "var(--space-red)",
              }}
            >
              {trendPositive ? "▲" : "▼"}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        {/* Valeur principale */}
        <div>
          <div className="text-3xl font-extrabold font-mono" style={{ color }}>
            <CountUp to={value} duration={duration} delay={0.1} />
            <span className="text-2xl">{suffix}</span>
          </div>
          <p className="text-sm font-medium mt-0.5" style={{ color: "var(--space-text)" }}>
            {label}
          </p>
        </div>

        {/* Description optionnelle */}
        {description && (
          <p className="text-xs" style={{ color: "var(--space-muted)" }}>
            {description}
          </p>
        )}
      </div>
    </SpotlightCard>
  );
};

export default StatCard;
