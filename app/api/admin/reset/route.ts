import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  await db.session.deleteMany();
  return NextResponse.json({ ok: true });
}
