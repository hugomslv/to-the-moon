import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [total, completed, avgTimeResult, puzzleStats, surveyResult] = await Promise.all([
    db.session.count(),
    db.session.count({ where: { completed: true } }),
    db.session.aggregate({ where: { completed: true }, _avg: { totalTimeMs: true } }),
    db.puzzleAttempt.groupBy({
      by: ["puzzleId"],
      _avg: { attempts: true },
      _count: { _all: true },
    }),
    db.survey.aggregate({ _avg: { rating: true, difficulty: true } }),
  ]);

  return NextResponse.json({
    total,
    completed,
    avgTimeMs: Math.round(avgTimeResult._avg.totalTimeMs ?? 0),
    puzzleStats,
    avgRating: surveyResult._avg.rating ?? 0,
    avgDifficulty: surveyResult._avg.difficulty ?? 0,
  });
}
