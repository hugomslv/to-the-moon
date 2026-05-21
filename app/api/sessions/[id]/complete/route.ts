import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = (await req.json()) as { totalTimeMs: number };
  const totalTimeMs = Math.max(0, Math.round(body.totalTimeMs));

  const session = await db.session.update({
    where: { id },
    data: { completed: true, finishedAt: new Date(), totalTimeMs },
  });

  return NextResponse.json({ ok: true, sessionId: session.id });
}
