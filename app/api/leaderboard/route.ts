import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const sessions = await db.session.findMany({
    where: { completed: true, totalTimeMs: { not: null } },
    orderBy: { totalTimeMs: "asc" },
    take: 20,
    select: { id: true, teamName: true, totalTimeMs: true, finishedAt: true },
  });

  return NextResponse.json(sessions);
}
