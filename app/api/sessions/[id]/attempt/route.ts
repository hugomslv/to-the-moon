import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = (await req.json()) as { puzzleId: string; solved: boolean; hintsUsed: number };
  const { puzzleId, solved, hintsUsed } = body;

  const existing = await db.puzzleAttempt.findUnique({
    where: { sessionId_puzzleId: { sessionId: id, puzzleId } },
  });

  const attempt = existing
    ? await db.puzzleAttempt.update({
        where: { sessionId_puzzleId: { sessionId: id, puzzleId } },
        data: {
          attempts: { increment: 1 },
          hintsUsed,
          solvedAt: solved ? new Date() : undefined,
        },
      })
    : await db.puzzleAttempt.create({
        data: {
          sessionId: id,
          puzzleId,
          attempts: 1,
          hintsUsed,
          solvedAt: solved ? new Date() : null,
        },
      });

  return NextResponse.json(attempt);
}
