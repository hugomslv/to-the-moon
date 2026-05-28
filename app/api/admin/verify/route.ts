// API de vérification du token admin (utilisée par le hook useAdminAuth)
import { NextRequest, NextResponse } from "next/server";
import { verifyToken, ADMIN_COOKIE } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return NextResponse.json({ valid: false }, { status: 401 });

  const result = await verifyToken(token);
  if (!result.valid) return NextResponse.json({ valid: false }, { status: 401 });

  return NextResponse.json({ valid: true, username: result.username });
}
