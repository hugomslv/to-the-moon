// API : liste des sessions pour le tableau admin (tri, pagination)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "10", 10));
  const search = searchParams.get("search") ?? "";
  const sortBy = (searchParams.get("sortBy") ?? "startedAt") as "startedAt" | "totalTimeMs" | "teamName";
  const order = (searchParams.get("order") ?? "desc") as "asc" | "desc";

  const where = search
    ? { teamName: { contains: search } }
    : {};

  const [sessions, total] = await Promise.all([
    db.session.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        teamName: true,
        startedAt: true,
        finishedAt: true,
        totalTimeMs: true,
        completed: true,
        attempts: {
          select: { puzzleId: true, attempts: true, hintsUsed: true },
        },
      },
    }),
    db.session.count({ where }),
  ]);

  return NextResponse.json({ sessions, total, page, limit });
}
