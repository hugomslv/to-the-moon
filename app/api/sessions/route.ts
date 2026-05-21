import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { teamName?: unknown };
  const teamName = String(body.teamName ?? "").trim().slice(0, 32);

  if (!teamName) {
    return NextResponse.json({ error: "Nom d'équipe requis" }, { status: 400 });
  }

  const session = await db.session.create({ data: { teamName } });
  return NextResponse.json({ sessionId: session.id }, { status: 201 });
}
