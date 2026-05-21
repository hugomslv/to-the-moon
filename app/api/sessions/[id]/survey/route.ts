import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = (await req.json()) as { rating: number; difficulty: number; comment?: string };
  const { rating, difficulty, comment } = body;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "rating invalide (1–5)" }, { status: 400 });
  }
  if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 5) {
    return NextResponse.json({ error: "difficulty invalide (1–5)" }, { status: 400 });
  }

  const survey = await db.survey.create({
    data: {
      sessionId: id,
      rating,
      difficulty,
      comment: typeof comment === "string" ? comment.trim().slice(0, 500) || null : null,
    },
  });

  return NextResponse.json(survey, { status: 201 });
}
