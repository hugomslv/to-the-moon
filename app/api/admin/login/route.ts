// API de connexion admin
// TODO : remplacer par un appel à une vraie API (ex: Spring Boot /api/auth/login) en supprimant
//        validateCredentials() et en vérifiant la réponse du backend distant.
import { NextRequest, NextResponse } from "next/server";
import { validateCredentials, generateToken, ADMIN_COOKIE } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const { username, password } = (await req.json()) as {
    username: string;
    password: string;
  };

  if (!username || !password) {
    return NextResponse.json({ error: "Champs requis" }, { status: 400 });
  }

  // Simulation d'un délai réseau pour éviter l'énumération par timing
  await new Promise(r => setTimeout(r, 300 + Math.random() * 200));

  if (!(await validateCredentials(username, password))) {
    return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
  }

  const token = await generateToken(username);

  const response = NextResponse.json({ ok: true, username });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    // secure: true, // Activer en production HTTPS
    maxAge: 8 * 60 * 60, // 8 heures
    path: "/",
  });
  return response;
}
